from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from assets.models import (
    Base, EquipmentType, Inventory, Purchase, Transfer,
    Assignment, Expenditure, UserRole
)
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Seed the database with dummy data for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database with dummy data...')
        
        # Clear existing data (except users)
        self.stdout.write('Clearing existing data...')
        Purchase.objects.all().delete()
        Transfer.objects.all().delete()
        Assignment.objects.all().delete()
        Expenditure.objects.all().delete()
        Inventory.objects.all().delete()
        
        # Get existing data
        bases = list(Base.objects.all())
        equipment_types = list(EquipmentType.objects.all())
        users = list(User.objects.all())
        
        if not bases or not equipment_types or not users:
            self.stdout.write(self.style.ERROR('Please ensure bases, equipment types, and users exist first!'))
            return
        
        # Create Purchases (30 records over the last 90 days)
        self.stdout.write('Creating purchases...')
        for i in range(30):
            days_ago = random.randint(1, 90)
            purchase_date = datetime.now().date() - timedelta(days=days_ago)
            
            base = random.choice(bases)
            equipment_type = random.choice(equipment_types)
            quantity = random.randint(10, 500)
            
            purchase = Purchase.objects.create(
                base=base,
                equipment_type=equipment_type,
                quantity=quantity,
                supplier=random.choice([
                    'Defense Supplies Inc.',
                    'Military Equipment Corp.',
                    'Global Arms Ltd.',
                    'Strategic Resources Co.',
                    'National Defense Suppliers',
                    'Allied Equipment Group'
                ]),
                purchase_date=purchase_date,
                created_by=random.choice(users)
            )
            
            # Update inventory
            inventory, created = Inventory.objects.get_or_create(
                base=base,
                equipment_type=equipment_type,
                defaults={'quantity': 0}
            )
            inventory.quantity += quantity
            inventory.save()
        
        self.stdout.write(self.style.SUCCESS(f'Created {Purchase.objects.count()} purchases'))
        
        # Create Transfers (20 records)
        self.stdout.write('Creating transfers...')
        for i in range(20):
            days_ago = random.randint(1, 60)
            transfer_date = datetime.now().date() - timedelta(days=days_ago)
            
            from_base = random.choice(bases)
            to_base = random.choice([b for b in bases if b != from_base])
            
            Transfer.objects.create(
                from_base=from_base,
                to_base=to_base,
                equipment_type=random.choice(equipment_types),
                quantity=random.randint(5, 100),
                status=random.choice(['pending', 'in_transit', 'completed']),
                transfer_date=transfer_date,
                created_by=random.choice(users)
            )
        
        self.stdout.write(self.style.SUCCESS(f'Created {Transfer.objects.count()} transfers'))
        
        # Create Assignments (25 records)
        self.stdout.write('Creating assignments...')
        personnel_names = [
            'Sgt. John Smith', 'Cpl. Sarah Johnson', 'Lt. Michael Brown',
            'Pvt. Emily Davis', 'Sgt. David Wilson', 'Cpl. Jessica Martinez',
            'Lt. Robert Anderson', 'Pvt. Amanda Taylor', 'Sgt. Christopher Lee',
            'Cpl. Jennifer White', 'Lt. Matthew Harris', 'Pvt. Ashley Clark',
            'Sgt. Daniel Lewis', 'Cpl. Melissa Walker', 'Lt. James Hall'
        ]
        
        for i in range(25):
            days_ago = random.randint(1, 120)
            assignment_date = datetime.now().date() - timedelta(days=days_ago)
            
            assigned_qty = random.randint(1, 20)
            returned_qty = random.randint(0, assigned_qty) if random.random() > 0.3 else 0
            
            return_date = None
            if returned_qty > 0:
                return_date = assignment_date + timedelta(days=random.randint(7, 60))
            
            Assignment.objects.create(
                base=random.choice(bases),
                equipment_type=random.choice(equipment_types),
                personnel_name=random.choice(personnel_names),
                personnel_id=f'MIL-{random.randint(10000, 99999)}',
                assigned_quantity=assigned_qty,
                returned_quantity=returned_qty,
                assignment_date=assignment_date,
                return_date=return_date,
                created_by=random.choice(users)
            )
        
        self.stdout.write(self.style.SUCCESS(f'Created {Assignment.objects.count()} assignments'))
        
        # Create Expenditures (15 records)
        self.stdout.write('Creating expenditures...')
        expenditure_reasons = [
            'Training Exercise',
            'Combat Operations',
            'Equipment Testing',
            'Maintenance and Repair',
            'Emergency Response',
            'Field Operations',
            'Tactical Drills',
            'Equipment Damage',
            'Lost in Field',
            'Routine Consumption'
        ]
        
        for i in range(15):
            days_ago = random.randint(1, 90)
            expenditure_date = datetime.now().date() - timedelta(days=days_ago)
            
            Expenditure.objects.create(
                base=random.choice(bases),
                equipment_type=random.choice(equipment_types),
                quantity=random.randint(1, 50),
                reason=random.choice(expenditure_reasons),
                expenditure_date=expenditure_date,
                created_by=random.choice(users)
            )
        
        self.stdout.write(self.style.SUCCESS(f'Created {Expenditure.objects.count()} expenditures'))
        
        # Display inventory summary
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('Seed data created successfully!'))
        self.stdout.write('='*50)
        
        self.stdout.write('\nInventory Summary:')
        for base in bases:
            inventory_items = Inventory.objects.filter(base=base)
            total_qty = sum(item.quantity for item in inventory_items)
            self.stdout.write(f'  {base.name}: {total_qty} total items across {inventory_items.count()} equipment types')
        
        self.stdout.write('\nData Summary:')
        self.stdout.write(f'  Purchases: {Purchase.objects.count()}')
        self.stdout.write(f'  Transfers: {Transfer.objects.count()}')
        self.stdout.write(f'  Assignments: {Assignment.objects.count()}')
        self.stdout.write(f'  Expenditures: {Expenditure.objects.count()}')
        self.stdout.write(f'  Inventory Items: {Inventory.objects.count()}')
