"""
OS Manager - Sistema de Gestão de Ordens de Serviço
Backend API desenvolvido em FastAPI

Copyright (c) 2025 Thiago de Souza Molter
Todos os direitos reservados.

Desenvolvedor: Thiago de Souza Molter
Data: 31 de Agosto de 2025
Versão: 1.0.0
"""

from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.hash import bcrypt
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = "your-secret-key-here"  # In production, use a strong secret
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Enums
class UserType(str, Enum):
    ADMIN = "admin"
    TECNICO = "tecnico"

class OSStatus(str, Enum):
    ABERTA = "Aberta"
    ATRIBUIDA = "Atribuída"
    EM_ANDAMENTO = "Em Andamento"
    PAUSADA = "Pausada"
    CONCLUIDA = "Concluída"
    CANCELADA = "Cancelada"

class Priority(str, Enum):
    BAIXA = "Baixa"
    MEDIA = "Média"
    ALTA = "Alta"
    CRITICA = "Crítica"

class MaterialStatus(str, Enum):
    SOLICITADO = "Solicitado"
    APROVADO = "Aprovado"
    ENTREGUE = "Entregue"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    password_hash: str
    user_type: UserType
    full_name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    user_type: UserType
    full_name: str

class UserLogin(BaseModel):
    username: str
    password: str

class ServiceOrder(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    numero_os: str = Field(default_factory=lambda: f"OS{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:6]}")
    descricao: str
    tipo_servico: str
    responsavel: str
    prioridade: Priority
    local: str
    equipamento: str
    data_solicitacao: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    data_atendimento: Optional[datetime] = None
    status: OSStatus = OSStatus.ABERTA
    created_by: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ServiceOrderCreate(BaseModel):
    descricao: str
    tipo_servico: str
    responsavel: str
    prioridade: Priority
    local: str
    equipamento: str
    data_atendimento: Optional[datetime] = None

class ServiceOrderUpdate(BaseModel):
    descricao: Optional[str] = None
    tipo_servico: Optional[str] = None
    responsavel: Optional[str] = None
    prioridade: Optional[Priority] = None
    local: Optional[str] = None
    equipamento: Optional[str] = None
    data_atendimento: Optional[datetime] = None
    status: Optional[OSStatus] = None

class Material(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    os_id: str
    descricao: str
    quantidade: int
    status: MaterialStatus = MaterialStatus.SOLICITADO
    solicitado_por: str
    data_solicitacao: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    aprovado_por: Optional[str] = None
    data_aprovacao: Optional[datetime] = None

class MaterialCreate(BaseModel):
    os_id: str
    descricao: str
    quantidade: int

class MaterialUpdate(BaseModel):
    status: MaterialStatus
    aprovado_por: Optional[str] = None

# Helper Functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"username": username})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def prepare_for_mongo(data):
    """Convert datetime objects to ISO strings for MongoDB storage"""
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

def parse_from_mongo(item):
    """Parse datetime strings back from MongoDB"""
    if isinstance(item, dict):
        for key, value in item.items():
            if isinstance(value, str) and key.endswith(('_at', '_solicitacao', '_atendimento', '_aprovacao')):
                try:
                    item[key] = datetime.fromisoformat(value.replace('Z', '+00:00'))
                except:
                    pass
    return item

# Auth Routes
@api_router.post("/register")
async def register_user(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Hash password
    password_hash = bcrypt.hash(user_data.password)
    
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=password_hash,
        user_type=user_data.user_type,
        full_name=user_data.full_name
    )
    
    user_dict = prepare_for_mongo(user.dict())
    await db.users.insert_one(user_dict)
    
    return {"message": "User created successfully", "user_id": user.id}

@api_router.post("/login")
async def login(user_data: UserLogin):
    user = await db.users.find_one({"username": user_data.username})
    if not user or not bcrypt.verify(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "full_name": user["full_name"],
            "user_type": user["user_type"]
        }
    }

# Service Order Routes
@api_router.post("/service-orders", response_model=ServiceOrder)
async def create_service_order(os_data: ServiceOrderCreate, current_user: User = Depends(get_current_user)):
    service_order = ServiceOrder(
        **os_data.dict(),
        created_by=current_user.username
    )
    
    os_dict = prepare_for_mongo(service_order.dict())
    await db.service_orders.insert_one(os_dict)
    
    return service_order

@api_router.get("/service-orders", response_model=List[ServiceOrder])
async def get_service_orders(current_user: User = Depends(get_current_user)):
    service_orders = await db.service_orders.find().to_list(1000)
    return [ServiceOrder(**parse_from_mongo(os)) for os in service_orders]

@api_router.get("/service-orders/{os_id}", response_model=ServiceOrder)
async def get_service_order(os_id: str, current_user: User = Depends(get_current_user)):
    service_order = await db.service_orders.find_one({"id": os_id})
    if not service_order:
        raise HTTPException(status_code=404, detail="Service Order not found")
    return ServiceOrder(**parse_from_mongo(service_order))

@api_router.put("/service-orders/{os_id}", response_model=ServiceOrder)
async def update_service_order(os_id: str, os_data: ServiceOrderUpdate, current_user: User = Depends(get_current_user)):
    update_data = {k: v for k, v in os_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    update_data = prepare_for_mongo(update_data)
    
    result = await db.service_orders.update_one(
        {"id": os_id}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service Order not found")
    
    updated_os = await db.service_orders.find_one({"id": os_id})
    return ServiceOrder(**parse_from_mongo(updated_os))

# Material Routes
@api_router.post("/materials", response_model=Material)
async def create_material(material_data: MaterialCreate, current_user: User = Depends(get_current_user)):
    material = Material(
        **material_data.dict(),
        solicitado_por=current_user.username
    )
    
    material_dict = prepare_for_mongo(material.dict())
    await db.materials.insert_one(material_dict)
    
    return material

@api_router.get("/materials", response_model=List[Material])
async def get_materials(os_id: Optional[str] = None, current_user: User = Depends(get_current_user)):
    query = {"os_id": os_id} if os_id else {}
    materials = await db.materials.find(query).to_list(1000)
    return [Material(**parse_from_mongo(material)) for material in materials]

@api_router.put("/materials/{material_id}", response_model=Material)
async def update_material(material_id: str, material_data: MaterialUpdate, current_user: User = Depends(get_current_user)):
    update_data = material_data.dict()
    if material_data.status == MaterialStatus.APROVADO:
        update_data["aprovado_por"] = current_user.username
        update_data["data_aprovacao"] = datetime.now(timezone.utc)
    
    update_data = prepare_for_mongo(update_data)
    
    result = await db.materials.update_one(
        {"id": material_id}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Material not found")
    
    updated_material = await db.materials.find_one({"id": material_id})
    return Material(**parse_from_mongo(updated_material))

# Dashboard Routes
@api_router.get("/dashboard")
async def get_dashboard_data(current_user: User = Depends(get_current_user)):
    # Count OS by status
    pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    os_by_status = await db.service_orders.aggregate(pipeline).to_list(None)
    
    # Count OS by technician
    pipeline = [
        {"$group": {"_id": "$responsavel", "count": {"$sum": 1}}}
    ]
    os_by_tech = await db.service_orders.aggregate(pipeline).to_list(None)
    
    # Total counts
    total_os = await db.service_orders.count_documents({})
    total_materials = await db.materials.count_documents({})
    
    return {
        "total_os": total_os,
        "total_materials": total_materials,
        "os_by_status": os_by_status,
        "os_by_technician": os_by_tech
    }

@api_router.get("/")
async def root():
    return {"message": "Service Order Management API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()