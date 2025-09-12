import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data first
  await prisma.task.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.note.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  await prisma.stage.deleteMany();
  await prisma.pipeline.deleteMany();
  await prisma.teamMembership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();
  await prisma.role.deleteMany();

  console.log("✅ Cleared existing data");

  // Create roles
  const adminRole = await prisma.role.create({ data: { name: "ADMIN" } });
  const managerRole = await prisma.role.create({ data: { name: "MANAGER" } });
  const userRole = await prisma.role.create({ data: { name: "USER" } });

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@techcorp.com",
      name: "Sarah Johnson",
      password: await bcrypt.hash("admin123", 10),
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      email: "mike.davis@techcorp.com",
      name: "Mike Davis",
      password: await bcrypt.hash("password123", 10),
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      email: "jane.smith@techcorp.com",
      name: "Jane Smith",
      password: await bcrypt.hash("password123", 10),
    },
  });

  console.log("✅ Created users");

  // Create team
  const team = await prisma.team.create({
    data: {
      id: "seed-team",
      name: "TechCorp Sales Team",
      ownerId: adminUser.id,
    },
  });

  // Create team memberships
  await prisma.teamMembership.createMany({
    data: [
      { role: "ADMIN", teamId: team.id, userId: adminUser.id },
      { role: "MANAGER", teamId: team.id, userId: managerUser.id },
      { role: "USER", teamId: team.id, userId: salesUser.id },
    ],
  });

  console.log("✅ Created team and memberships");

  // Create pipeline and stages
  const pipeline = await prisma.pipeline.create({
    data: {
      name: "Sales Pipeline",
      teamId: team.id,
    },
  });

  const stages = await Promise.all([
    prisma.stage.create({
      data: { name: "Lead", order: 1, pipelineId: pipeline.id },
    }),
    prisma.stage.create({
      data: { name: "Qualified", order: 2, pipelineId: pipeline.id },
    }),
    prisma.stage.create({
      data: { name: "Proposal", order: 3, pipelineId: pipeline.id },
    }),
    prisma.stage.create({
      data: { name: "Negotiation", order: 4, pipelineId: pipeline.id },
    }),
    prisma.stage.create({
      data: { name: "Closed Won", order: 5, pipelineId: pipeline.id },
    }),
    prisma.stage.create({
      data: { name: "Closed Lost", order: 6, pipelineId: pipeline.id },
    }),
  ]);

  console.log("✅ Created pipeline and stages");

  // Create companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: "Innovate Solutions Inc.",
        domain: "innovatesolutions.com",
        teamId: team.id,
        ownerId: adminUser.id,
      },
    }),
    prisma.company.create({
      data: {
        name: "Global Manufacturing Corp",
        domain: "globalmanufacturing.com",
        teamId: team.id,
        ownerId: managerUser.id,
      },
    }),
    prisma.company.create({
      data: {
        name: "HealthTech Ventures",
        domain: "healthtechventures.com",
        teamId: team.id,
        ownerId: salesUser.id,
      },
    }),
    prisma.company.create({
      data: {
        name: "EcoEnergy Systems",
        domain: "ecoenergysystems.com",
        teamId: team.id,
        ownerId: adminUser.id,
      },
    }),
    prisma.company.create({
      data: {
        name: "DataFlow Analytics",
        domain: "dataflowanalytics.com",
        teamId: team.id,
        ownerId: managerUser.id,
      },
    }),
    prisma.company.create({
      data: {
        name: "RetailMax Enterprises",
        domain: "retailmax.com",
        teamId: team.id,
        ownerId: salesUser.id,
      },
    }),
    prisma.company.create({
      data: {
        name: "FinanceFirst Solutions",
        domain: "financefirst.com",
        teamId: team.id,
        ownerId: adminUser.id,
      },
    }),
    prisma.company.create({
      data: {
        name: "EduTech Academy",
        domain: "edutechacademy.com",
        teamId: team.id,
        ownerId: managerUser.id,
      },
    }),
  ]);

  console.log(`✅ Created ${companies.length} companies`);

  // Create contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        firstName: "Robert",
        lastName: "Chen",
        email: "robert.chen@innovatesolutions.com",
        phone: "+1 (555) 123-4567",
        jobTitle: "Chief Technology Officer",
        companyId: companies[0].id,
        teamId: team.id,
        ownerId: adminUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily.rodriguez@innovatesolutions.com",
        phone: "+1 (555) 123-4568",
        jobTitle: "VP of Product Development",
        companyId: companies[0].id,
        teamId: team.id,
        ownerId: managerUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "James",
        lastName: "Wilson",
        email: "james.wilson@globalmanufacturing.com",
        phone: "+1 (555) 987-6543",
        jobTitle: "Operations Director",
        companyId: companies[1].id,
        teamId: team.id,
        ownerId: salesUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Lisa",
        lastName: "Thompson",
        email: "lisa.thompson@globalmanufacturing.com",
        phone: "+1 (555) 987-6544",
        jobTitle: "IT Manager",
        companyId: companies[1].id,
        teamId: team.id,
        ownerId: adminUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Michael",
        lastName: "Foster",
        email: "michael.foster@healthtechventures.com",
        phone: "+1 (555) 456-7890",
        jobTitle: "Chief Medical Officer",
        companyId: companies[2].id,
        teamId: team.id,
        ownerId: managerUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Sarah",
        lastName: "Kim",
        email: "sarah.kim@healthtechventures.com",
        phone: "+1 (555) 456-7891",
        jobTitle: "Head of Digital Innovation",
        companyId: companies[2].id,
        teamId: team.id,
        ownerId: salesUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "David",
        lastName: "Green",
        email: "david.green@ecoenergysystems.com",
        phone: "+1 (555) 321-0987",
        jobTitle: "Sustainability Director",
        companyId: companies[3].id,
        teamId: team.id,
        ownerId: adminUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Maria",
        lastName: "Gonzalez",
        email: "maria.gonzalez@ecoenergysystems.com",
        phone: "+1 (555) 321-0988",
        jobTitle: "Project Manager",
        companyId: companies[3].id,
        teamId: team.id,
        ownerId: managerUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Alex",
        lastName: "Taylor",
        email: "alex.taylor@dataflowanalytics.com",
        phone: "+1 (555) 654-3210",
        jobTitle: "Chief Data Officer",
        companyId: companies[4].id,
        teamId: team.id,
        ownerId: salesUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Jessica",
        lastName: "Brown",
        email: "jessica.brown@dataflowanalytics.com",
        phone: "+1 (555) 654-3211",
        jobTitle: "Senior Analytics Manager",
        companyId: companies[4].id,
        teamId: team.id,
        ownerId: adminUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Mark",
        lastName: "Anderson",
        email: "mark.anderson@retailmax.com",
        phone: "+1 (555) 789-0123",
        jobTitle: "Chief Information Officer",
        companyId: companies[5].id,
        teamId: team.id,
        ownerId: managerUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Jennifer",
        lastName: "Lee",
        email: "jennifer.lee@retailmax.com",
        phone: "+1 (555) 789-0124",
        jobTitle: "Digital Transformation Lead",
        companyId: companies[5].id,
        teamId: team.id,
        ownerId: salesUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Thomas",
        lastName: "White",
        email: "thomas.white@financefirst.com",
        phone: "+1 (555) 234-5678",
        jobTitle: "VP of Technology",
        companyId: companies[6].id,
        teamId: team.id,
        ownerId: adminUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Amanda",
        lastName: "Clark",
        email: "amanda.clark@financefirst.com",
        phone: "+1 (555) 234-5679",
        jobTitle: "Business Process Manager",
        companyId: companies[6].id,
        teamId: team.id,
        ownerId: managerUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Kevin",
        lastName: "Martinez",
        email: "kevin.martinez@edutechacademy.com",
        phone: "+1 (555) 567-8901",
        jobTitle: "Dean of Technology",
        companyId: companies[7].id,
        teamId: team.id,
        ownerId: salesUser.id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: "Rachel",
        lastName: "Davis",
        email: "rachel.davis@edutechacademy.com",
        phone: "+1 (555) 567-8902",
        jobTitle: "Director of Learning Innovation",
        companyId: companies[7].id,
        teamId: team.id,
        ownerId: adminUser.id,
      },
    }),
  ]);

  console.log(`✅ Created ${contacts.length} contacts`);

  // Create deals
  const deals = await Promise.all([
    prisma.deal.create({
      data: {
        title: "AI-Powered Analytics Platform",
        amount: 125000,
        closeDate: new Date("2025-01-15"),
        companyId: companies[0].id,
        contactId: contacts[0].id,
        stageId: stages[2].id,
        teamId: team.id,
        ownerId: adminUser.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: "Manufacturing Process Optimization",
        amount: 350000,
        closeDate: new Date("2025-02-28"),
        companyId: companies[1].id,
        contactId: contacts[2].id,
        stageId: stages[3].id,
        teamId: team.id,
        ownerId: salesUser.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: "Healthcare Data Integration Suite",
        amount: 275000,
        closeDate: new Date("2024-12-20"),
        companyId: companies[2].id,
        contactId: contacts[4].id,
        stageId: stages[4].id,
        teamId: team.id,
        ownerId: managerUser.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: "Renewable Energy Management System",
        amount: 89000,
        closeDate: new Date("2025-03-10"),
        companyId: companies[3].id,
        contactId: contacts[6].id,
        stageId: stages[1].id,
        teamId: team.id,
        ownerId: adminUser.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: "Advanced Analytics Dashboard",
        amount: 195000,
        closeDate: new Date("2025-01-30"),
        companyId: companies[4].id,
        contactId: contacts[8].id,
        stageId: stages[2].id,
        teamId: team.id,
        ownerId: salesUser.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: "Retail Customer Experience Platform",
        amount: 425000,
        closeDate: new Date("2025-04-15"),
        companyId: companies[5].id,
        contactId: contacts[10].id,
        stageId: stages[0].id,
        teamId: team.id,
        ownerId: managerUser.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: "Financial Automation Suite",
        amount: 315000,
        closeDate: new Date("2025-02-10"),
        companyId: companies[6].id,
        contactId: contacts[12].id,
        stageId: stages[3].id,
        teamId: team.id,
        ownerId: adminUser.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: "Educational Technology Platform",
        amount: 155000,
        closeDate: new Date("2024-11-30"),
        companyId: companies[7].id,
        contactId: contacts[14].id,
        stageId: stages[5].id,
        teamId: team.id,
        ownerId: salesUser.id,
      },
    }),
  ]);

  console.log(`✅ Created ${deals.length} deals`);

  // Create tasks
  await Promise.all([
    prisma.task.create({
      data: {
        title: "Follow up on AI platform demo feedback",
        dueAt: new Date("2024-12-12"),
        companyId: companies[0].id,
        contactId: contacts[0].id,
        dealId: deals[0].id,
        ownerId: adminUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Send contract for final review",
        dueAt: new Date("2024-12-12"),
        companyId: companies[6].id,
        contactId: contacts[12].id,
        dealId: deals[6].id,
        ownerId: adminUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Prepare manufacturing cost analysis proposal",
        dueAt: new Date("2024-12-13"),
        companyId: companies[1].id,
        contactId: contacts[2].id,
        dealId: deals[1].id,
        ownerId: salesUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Schedule technical review meeting",
        dueAt: new Date("2024-12-14"),
        companyId: companies[2].id,
        contactId: contacts[4].id,
        dealId: deals[2].id,
        ownerId: managerUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Update analytics requirements document",
        dueAt: new Date("2024-12-08"),
        companyId: companies[4].id,
        contactId: contacts[8].id,
        dealId: deals[4].id,
        ownerId: salesUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Conduct initial discovery call",
        dueAt: new Date("2024-12-05"),
        completedAt: new Date("2024-12-05"),
        companyId: companies[1].id,
        contactId: contacts[2].id,
        dealId: deals[1].id,
        ownerId: managerUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Research competitor solutions for education sector",
        dueAt: new Date("2024-12-20"),
        companyId: companies[7].id,
        contactId: contacts[14].id,
        ownerId: salesUser.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Schedule executive stakeholder meeting",
        dueAt: new Date("2024-12-18"),
        companyId: companies[1].id,
        contactId: contacts[3].id,
        dealId: deals[1].id,
        ownerId: managerUser.id,
      },
    }),
  ]);

  console.log("✅ Created 8 tasks");

  // Create some notes
  await Promise.all([
    prisma.note.create({
      data: {
        content:
          "Company is very interested in AI solutions. Looking to modernize their analytics platform.",
        companyId: companies[0].id,
        contactId: contacts[0].id,
        ownerId: adminUser.id,
      },
    }),
    prisma.note.create({
      data: {
        content:
          "Budget approved for Q1 2025. Decision maker is very engaged in the process.",
        companyId: companies[1].id,
        contactId: contacts[2].id,
        ownerId: salesUser.id,
      },
    }),
    prisma.note.create({
      data: {
        content:
          "Excellent meeting with the technical team. They are excited about our healthcare solutions.",
        companyId: companies[2].id,
        contactId: contacts[4].id,
        ownerId: managerUser.id,
      },
    }),
  ]);

  console.log("✅ Created 3 notes");

  // Create some activities
  await Promise.all([
    prisma.activity.create({
      data: {
        type: "CALL",
        subject: "Discovery call with CTO to understand technical requirements",
        companyId: companies[0].id,
        contactId: contacts[0].id,
        dealId: deals[0].id,
        ownerId: adminUser.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: "MEETING",
        subject: "Product demo presentation to the executive team",
        companyId: companies[1].id,
        contactId: contacts[2].id,
        dealId: deals[1].id,
        ownerId: salesUser.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: "EMAIL",
        subject:
          "Follow-up email with pricing proposal and implementation timeline",
        companyId: companies[2].id,
        contactId: contacts[4].id,
        dealId: deals[2].id,
        ownerId: managerUser.id,
      },
    }),
  ]);

  console.log("✅ Created 3 activities");

  console.log("");
  console.log("🎉 Enhanced seed data created successfully!");
  console.log("");
  console.log("Summary:");
  console.log("- 3 users with different roles");
  console.log("- 8 companies across diverse industries");
  console.log("- 16 contacts with realistic roles");
  console.log("- 8 deals at various stages");
  console.log("- 8 tasks with different priorities and statuses");
  console.log("- 3 company/contact notes");
  console.log("- 3 activity records");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
