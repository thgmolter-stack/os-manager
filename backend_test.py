import requests
import sys
import json
from datetime import datetime

class ServiceOrderAPITester:
    def __init__(self, base_url="https://task-manager-77.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_os_id = None
        self.created_material_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=True):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 500:
                        print(f"   Response: {response_data}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_register_user(self):
        """Test user registration"""
        user_data = {
            "username": "admin",
            "email": "admin@teste.com",
            "password": "123456",
            "user_type": "admin",
            "full_name": "João Silva"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "register",
            200,
            data=user_data,
            auth_required=False
        )
        return success

    def test_login(self):
        """Test login and get token"""
        login_data = {
            "username": "admin",
            "password": "123456"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "login",
            200,
            data=login_data,
            auth_required=False
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_data = response.get('user', {})
            print(f"   Token obtained: {self.token[:20]}...")
            print(f"   User: {self.user_data}")
            return True
        return False

    def test_create_service_order(self):
        """Test creating a service order"""
        os_data = {
            "descricao": "Manutenção preventiva ar condicionado",
            "tipo_servico": "Manutenção",
            "responsavel": "João Silva",
            "prioridade": "Alta",
            "local": "Sala 101",
            "equipamento": "Ar condicionado central"
        }
        
        success, response = self.run_test(
            "Create Service Order",
            "POST",
            "service-orders",
            200,
            data=os_data
        )
        
        if success and 'id' in response:
            self.created_os_id = response['id']
            print(f"   Created OS ID: {self.created_os_id}")
            return True
        return False

    def test_get_service_orders(self):
        """Test getting all service orders"""
        success, response = self.run_test(
            "Get Service Orders",
            "GET",
            "service-orders",
            200
        )
        
        if success:
            print(f"   Found {len(response)} service orders")
            return True
        return False

    def test_get_single_service_order(self):
        """Test getting a single service order"""
        if not self.created_os_id:
            print("❌ No OS ID available for single OS test")
            return False
            
        success, response = self.run_test(
            "Get Single Service Order",
            "GET",
            f"service-orders/{self.created_os_id}",
            200
        )
        return success

    def test_update_service_order(self):
        """Test updating a service order"""
        if not self.created_os_id:
            print("❌ No OS ID available for update test")
            return False
            
        update_data = {
            "status": "Em Andamento",
            "responsavel": "João Silva - Atualizado"
        }
        
        success, response = self.run_test(
            "Update Service Order",
            "PUT",
            f"service-orders/{self.created_os_id}",
            200,
            data=update_data
        )
        return success

    def test_create_material(self):
        """Test creating a material request"""
        if not self.created_os_id:
            print("❌ No OS ID available for material creation")
            return False
            
        material_data = {
            "os_id": self.created_os_id,
            "descricao": "Filtro de ar",
            "quantidade": 2
        }
        
        success, response = self.run_test(
            "Create Material",
            "POST",
            "materials",
            200,
            data=material_data
        )
        
        if success and 'id' in response:
            self.created_material_id = response['id']
            print(f"   Created Material ID: {self.created_material_id}")
            return True
        return False

    def test_get_materials(self):
        """Test getting all materials"""
        success, response = self.run_test(
            "Get Materials",
            "GET",
            "materials",
            200
        )
        
        if success:
            print(f"   Found {len(response)} materials")
            return True
        return False

    def test_update_material(self):
        """Test updating material status"""
        if not self.created_material_id:
            print("❌ No Material ID available for update test")
            return False
            
        update_data = {
            "status": "Aprovado"
        }
        
        success, response = self.run_test(
            "Update Material",
            "PUT",
            f"materials/{self.created_material_id}",
            200,
            data=update_data
        )
        return success

    def test_dashboard(self):
        """Test dashboard data"""
        success, response = self.run_test(
            "Get Dashboard Data",
            "GET",
            "dashboard",
            200
        )
        
        if success:
            expected_keys = ['total_os', 'total_materials', 'os_by_status', 'os_by_technician']
            has_all_keys = all(key in response for key in expected_keys)
            if has_all_keys:
                print(f"   Dashboard data complete: {response}")
                return True
            else:
                print(f"   Missing dashboard keys: {response}")
        return False

    def test_unauthorized_access(self):
        """Test that protected endpoints require authentication"""
        # Temporarily remove token
        original_token = self.token
        self.token = None
        
        success, response = self.run_test(
            "Unauthorized Access Test",
            "GET",
            "service-orders",
            401
        )
        
        # Restore token
        self.token = original_token
        return success

def main():
    print("🚀 Starting Service Order Management System API Tests")
    print("=" * 60)
    
    tester = ServiceOrderAPITester()
    
    # Test sequence
    test_sequence = [
        ("User Registration", tester.test_register_user),
        ("User Login", tester.test_login),
        ("Unauthorized Access", tester.test_unauthorized_access),
        ("Create Service Order", tester.test_create_service_order),
        ("Get Service Orders", tester.test_get_service_orders),
        ("Get Single Service Order", tester.test_get_single_service_order),
        ("Update Service Order", tester.test_update_service_order),
        ("Create Material", tester.test_create_material),
        ("Get Materials", tester.test_get_materials),
        ("Update Material", tester.test_update_material),
        ("Dashboard Data", tester.test_dashboard),
    ]
    
    # Run all tests
    for test_name, test_func in test_sequence:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%" if tester.tests_run > 0 else "No tests run")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 ALL TESTS PASSED!")
        return 0
    else:
        print("⚠️  SOME TESTS FAILED!")
        return 1

if __name__ == "__main__":
    sys.exit(main())