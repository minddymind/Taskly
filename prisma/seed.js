const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const departments = [
        'Accounting',
        'Content Creative',
        'Development',
        'Human Resources',
    ];

    // Create departments
    const createdDepartments = await Promise.all(
        departments.map((name, index) =>
            prisma.department.create({
                data: {
                    department_id: index + 1,
                    department_name: name,
                    manager_id: null,
                },
            })
        )
    );

    console.log('Departments created:', createdDepartments);

    // Seed employees for each department
    let empIdCounter = 1;

    for (const department of createdDepartments) {
        for (let i = 1; i <= 5; i++) {
            const hashedPassword = await bcrypt.hash(`password${empIdCounter}`, 10);

            await prisma.employee.create({
                data: {
                    emp_id: empIdCounter,
                    acc_name: `${department.department_name}_emp_${i}`,
                    password: hashedPassword,
                    department_id: department.department_id,
                },
            });

            console.log(`Employee ${empIdCounter} added to ${department.department_name}`);
            empIdCounter++;
        }

        // Assign department manager
        await prisma.department.update({
            where: { department_id: department.department_id },
            data: {
                manager_id: empIdCounter - 1,
            },
        });
    }

    console.log('All employees seeded successfully!');
}

main()
    .catch((error) => {
        console.error('Error seeding database:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
