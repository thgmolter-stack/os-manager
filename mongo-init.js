// OS Manager - MongoDB Initialization Script
// Desenvolvido por: Thiago de Souza Molter
// Versão: 1.0.0

// Conectar ao banco os_manager
db = db.getSiblingDB('os_manager');

// Criar usuário da aplicação
db.createUser({
  user: 'osmanager_app',
  pwd: 'senha_app',
  roles: [
    {
      role: 'readWrite',
      db: 'os_manager'
    }
  ]
});

// Criar coleções com índices otimizados
db.createCollection('users');
db.createCollection('service_orders');
db.createCollection('materials');

// Índices para users
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "user_type": 1 });

// Índices para service_orders
db.service_orders.createIndex({ "numero_os": 1 }, { unique: true });
db.service_orders.createIndex({ "status": 1 });
db.service_orders.createIndex({ "prioridade": 1 });
db.service_orders.createIndex({ "responsavel": 1 });
db.service_orders.createIndex({ "data_solicitacao": 1 });
db.service_orders.createIndex({ "created_by": 1 });

// Índices para materials
db.materials.createIndex({ "os_id": 1 });
db.materials.createIndex({ "status": 1 });
db.materials.createIndex({ "solicitado_por": 1 });
db.materials.createIndex({ "data_solicitacao": 1 });

// Inserir usuário administrador padrão (será removido após primeiro login)
db.users.insertOne({
  id: "default-admin-user",
  username: "admin",
  email: "admin@osmanager.com",
  password_hash: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewNhBx9lBY/1Vv8G", // admin123
  user_type: "admin",
  full_name: "Administrador do Sistema",
  created_at: new Date()
});

print("✅ Banco de dados OS Manager inicializado com sucesso!");
print("👤 Usuário admin padrão criado:");
print("   Usuário: admin");
print("   Senha: admin123");
print("🔒 IMPORTANTE: Altere a senha padrão após o primeiro login!");