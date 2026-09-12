import { PrismaClient, Role, OpportunityType, IdeaStatus, MediaType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing tables in order
  await prisma.auditLog.deleteMany({});
  await prisma.vote.deleteMany({});
  await prisma.pollOption.deleteMany({});
  await prisma.poll.deleteMany({});
  await prisma.moduleProgress.deleteMany({});
  await prisma.budgetModule.deleteMany({});
  await prisma.eventRegistration.deleteMany({});
  await prisma.eventRequest.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.opportunity.deleteMany({});
  await prisma.mediaItem.deleteMany({});
  await prisma.pollCategory.deleteMany({});
  await prisma.idea.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash("Password123!", 10);
  const adminPasswordHash = await bcrypt.hash("abila@123", 10);

  // 1. Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Abila Kamaloka",
      email: "abilakamaloka75@gmail.com",
      phone: "0769778941",
      county: "Kakamega",
      constituency: "Luambi",
      civicRole: "Secretariat Lead",
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
    },
  });

  const coordinatorUser = await prisma.user.create({
    data: {
      name: "Faith Chebet",
      email: "coordinator@nybf.ke",
      phone: "+254 700 000 002",
      county: "Nakuru",
      constituency: "Nakuru Town East",
      civicRole: "Rift Valley Regional Coordinator",
      role: Role.COORDINATOR,
      passwordHash: defaultPasswordHash,
    },
  });

  const memberUser = await prisma.user.create({
    data: {
      name: "Amani Mwangi",
      email: "amani.mwangi@nybf.ke",
      phone: "+254 712 345 678",
      county: "Nairobi",
      constituency: "Westlands",
      civicRole: "Youth Entrepreneur & Policy Advocate",
      role: Role.MEMBER,
      passwordHash: defaultPasswordHash,
    },
  });

  // Additional members for admin table view
  const additionalMembers = [
    { name: "Wangari Ochieng", email: "wangari@nybf.ke", phone: "+254 711 100 001", county: "Nairobi", civicRole: "Researcher" },
    { name: "Ahmed Kiptoo", email: "ahmed@nybf.ke", phone: "+254 711 100 002", county: "Uasin Gishu", civicRole: "Youth Leader" },
    { name: "Fatuma Ali", email: "fatuma@nybf.ke", phone: "+254 711 100 003", county: "Mombasa", civicRole: "Entrepreneur" },
    { name: "John Mutua", email: "john@nybf.ke", phone: "+254 711 100 004", county: "Machakos", civicRole: "Student" },
    { name: "Mercy Chepngetich", email: "mercy@nybf.ke", phone: "+254 711 100 005", county: "Bomet", civicRole: "Organizer" },
  ];

  for (const m of additionalMembers) {
    await prisma.user.create({
      data: {
        ...m,
        role: Role.MEMBER,
        passwordHash: defaultPasswordHash,
      },
    });
  }

  // 2. BudgetModules
  const modules = [
    {
      id: "mod-1",
      title: "Understanding Kenya's National Budget Architecture",
      description: "Learn how the National Treasury plans revenue estimates, borrows public debt, and allocates resources to national priorities and 47 county governments.",
      contentType: "text",
      order: 1,
      duration: "15 min read",
      difficulty: "Beginner",
      topics: ["Equitable Share", "Consolidated Fund", "Appropriation Act", "Debt Ceiling"],
      contentBody: `### 1. Where Does Kenya's Money Come From?
The national budget is Kenya's collective financial blueprint for the fiscal year (July 1st to June 30th). In FY 2026/27, the budget is estimated at over **Ksh 4.2 Trillion**.

Government revenue is primarily divided into:
- **Ordinary Revenue (Ksh ~2.9T):** Income tax (PAYE), Corporate tax, Value Added Tax (VAT), Customs & Excise duties collected by the Kenya Revenue Authority (KRA).
- **Non-Tax Revenue & Appropriation-in-Aid (Ksh ~400B):** Ministerial user fees, passport issuance, university tuition fees, park entry fees.
- **Deficit Financing / Borrowing (Ksh ~900B):** Domestic borrowing (Treasury Bills and Bonds via Central Bank of Kenya) and External commercial and concessional loans (IMF, World Bank, bilateral partners).

---

### 2. How the National Cake is Shared
Under **Article 202 and 203 of the Constitution of Kenya (2010)**, revenue raised nationally is shared equitably between the National Government and the 47 County Governments:

1. **Consolidated Fund Services (CFS):** Mandatory first-charge expenditures that cannot be altered or delayed (Public Debt interest and principal repayment, Constitutional Office salaries, pensions).
2. **National Government Ministries, Departments & Agencies (MDAs):** Defense, Internal Security, National Infrastructure, Higher Education, Foreign Affairs.
3. **County Equitable Share:** An unconditional transfer of revenue to all 47 counties (minimum 15% of the most recent audited revenues, currently over Ksh 400 Billion annually) to fund devolved functions like health centers, county roads, agriculture, and local youth polytechnics.

---

### 3. Key Takeaways for Youth Citizens
- **Public Debt Takes First Priority:** Over 60% of all taxes collected go towards servicing national debt before a single shilling is spent on roads, hospitals, or youth employment programs.
- **Devolution is Your Immediate Battlefield:** More than Ksh 400 Billion is disbursed directly to counties every year. Your local MCA and County Executive Committee (CEC) for Finance decide bursaries and ward projects.`,
    },
    {
      id: "mod-2",
      title: "The National & Devolved Budget Cycle (Formulation to Audit)",
      description: "Step-by-step citizen guide to the 4 phases: Formulation (Treasury/BROP), Approval (Parliament/Budget Committee), Execution (MDAs), and Oversight (Auditor-General).",
      contentType: "text",
      order: 2,
      duration: "20 min read",
      difficulty: "Intermediate",
      topics: ["Budget Policy Statement (BPS)", "County Fiscal Strategy Paper", "Public Participation"],
      contentBody: `### The 4 Stages of the Kenyan Budget Calendar

Kenya's budget process is continuous and runs throughout the calendar year across four distinct milestones:

#### Stage 1: Budget Formulation (August — February)
- **August/September:** The National Treasury issues the Budget Circular specifying economic priorities and ceiling limits to all ministries.
- **November:** The Budget Review and Outlook Paper (BROP) reviews performance of the prior fiscal year.
- **February:** The **Budget Policy Statement (BPS)** is tabled in Parliament. In counties, the **County Fiscal Strategy Paper (CFSP)** is submitted to the County Assembly.
- *Youth Action:* Attend BPS & CFSP public hearings. This is when budget ceilings are determined!

#### Stage 2: Budget Approval (March — June)
- **April 30th:** Detailed Ministerial Budget Estimates are submitted to the National Assembly.
- **May/June:** Parliamentary Departmental Committees hold public hearings on the Estimates and the **Finance Bill** (taxation laws).
- **June 30th:** Parliament passes the **Appropriation Act** authorizing government expenditure.
- *Youth Action:* Submit formal memorandums to the Finance & Planning Committee on controversial tax clauses or underfunded youth programs.

#### Stage 3: Budget Execution (July — June)
- The National Treasury and County Treasuries disburse funds quarterly to ministries and county departments.
- Controller of Budget (COB) approves exchequer releases after verifying compliance.

#### Stage 4: Audit & Oversight (Post-Fiscal Year)
- The **Auditor-General** audits all accounts and publishes reports exposed before the Public Accounts Committee (PAC) and Senate Public Accounts Committee (CPAC).`,
    },
    {
      id: "mod-3",
      title: "Youth Economic Planning & Access to Public Procurement (AGPO)",
      description: "Discover where young Kenyans fit into national economic planning and how to legally leverage the mandatory 30% AGPO youth procurement reservation.",
      contentType: "text",
      order: 3,
      duration: "18 min read",
      difficulty: "Practical Guide",
      topics: ["30% AGPO Quota", "Youth Enterprise Fund", "Hustler Fund Group Lending", "County Tenders"],
      contentBody: `### Demystifying the 30% AGPO Quota for Youth

Under the **Public Procurement and Asset Disposal Act (2015)** and National Treasury regulations, at least **30% of all public procurement tenders** at both National and County levels are reserved exclusively for Youth (aged 18–35), Women, and Persons with Disabilities (PWDs).

#### How to Participate:
1. **Business Registration:** Register an enterprise (Business Name, Company, or Partnership) via the eCitizen Business Registration Service (BRS).
2. **KRA Compliance:** Obtain a Tax Compliance Certificate (TCC).
3. **AGPO Certificate:** Apply for an AGPO Certificate online at agpo.go.ke (valid for 2 years).
4. **Bidding:** Monitor the Public Procurement Information Portal (tenders.go.ke) and local County Procurement portals for reserved youth tenders.`,
    },
    {
      id: "mod-4",
      title: "Taxation, the Finance Bill & Citizen Economic Rights",
      description: "Demystifying direct vs. indirect taxes, VAT, fuel levies, housing levies, and how youth memorandums can amend regressive tax proposals in Parliament.",
      contentType: "text",
      order: 4,
      duration: "22 min read",
      difficulty: "Advanced",
      topics: ["Finance Act", "KRA Revenue Targets", "Public Debt Service", "Constitution Art. 201"],
      contentBody: `### Understanding the Annual Finance Bill

The **Finance Bill** is the annual legislation presented by the Executive (through the Cabinet Secretary for the National Treasury) outlining the taxation measures and revenue collection instruments for the upcoming fiscal year.

#### Key Citizen Touchpoints:
- **Publication (April/May):** The Finance Bill is formally published in the Kenya Gazette and read in the National Assembly.
- **Departmental Committee Public Hearings:** The Finance & Planning Committee invites written memorandums and oral submissions from the public.
- **Debate & Clause-by-Clause Voting:** Members of Parliament vote on specific amendments (e.g. VAT exemptions, excise duty rates).
- **Presidential Assent (June):** Signed into law as the **Finance Act**.`,
    },
    {
      id: "mod-5",
      title: "County Budget Tracking: ADPs, CFSPs & Citizen Audits",
      description: "How to read your county government's Annual Development Plan and hold Governors and MCAs accountable for local youth development allocations.",
      contentType: "text",
      order: 5,
      duration: "15 min read",
      difficulty: "Devolution Guide",
      topics: ["County Bursary Funds", "Ward Development Fund", "Social Audits", "County Assembly Petitions"],
      contentBody: `### County Public Participation & Devolution Budgeting

Every financial year, 47 County Governments formulate two vital documents that determine local resource allocation:
1. **Annual Development Plan (ADP):** Published in September, defining priority capital projects per ward.
2. **County Fiscal Strategy Paper (CFSP):** Published in February, setting expenditure ceilings for county departments including Health, TVETs, and Youth Affairs.

Youth citizens have a constitutional right under Article 196 to submit written comments and attend County Assembly committee hearings before budget approval.`,
    },
    {
      id: "mod-6",
      title: "Public Debt, Eurobonds & Future Generational Liability",
      description: "An empirical breakdown of Kenya's Ksh 10.5 Trillion public debt portfolio, interest service ratios, and what debt restructuring means for youth employment.",
      contentType: "text",
      order: 6,
      duration: "25 min read",
      difficulty: "Macroeconomics",
      topics: ["Debt-to-GDP", "Multilateral Loans (IMF/World Bank)", "Eurobond Maturities", "Fiscal Deficit"],
      contentBody: `### The Structure of Kenya's Public Debt

Kenya's nominal public debt has surpassed Ksh 10.5 Trillion, comprising roughly 52% domestic debt (Treasury bills and bonds) and 48% external debt (multilateral lenders, commercial Eurobonds, and bilateral credit).

The greatest risk to youth development is debt servicing crowding out development expenditure. In recent fiscal cycles, debt service obligations consumed upwards of 65% of tax revenues, leaving limited fiscal space for job-creating infrastructure and public education capitation.`,
    },
  ];

  for (const m of modules) {
    await prisma.budgetModule.create({ data: m });
  }

  // Record ModuleProgress for sample member
  await prisma.moduleProgress.create({
    data: {
      userId: memberUser.id,
      moduleId: "mod-1",
      completed: true,
    },
  });

  // 3. Opportunities
  const opportunities = [
    {
      id: "opp-1",
      title: "National Youth Public Policy Research Fellowship 2026",
      type: OpportunityType.FELLOWSHIP,
      location: "Nairobi / Hybrid",
      deadline: new Date("2026-10-15T23:59:59Z"),
      description: "Paid 6-month fellowship analyzing Kenya's parliamentary finance bills and drafting youth policy amendments.",
      stipend: "Ksh 65,000 / month",
      applyUrl: "/my-nybf",
      createdBy: adminUser.id,
    },
    {
      id: "opp-2",
      title: "County Agri-Enterprise & Green Innovation Grant",
      type: OpportunityType.GRANT,
      location: "All 47 Counties",
      deadline: new Date("2026-10-30T23:59:59Z"),
      description: "Seed grants up to Ksh 500,000 for youth-led climate-smart agriculture and value-addition enterprises.",
      stipend: "Up to Ksh 500,000",
      applyUrl: "/my-nybf",
      createdBy: adminUser.id,
    },
    {
      id: "opp-3",
      title: "Digital Economy & AI Policy Research Internship",
      type: OpportunityType.INTERNSHIP,
      location: "Nairobi Central / Remote",
      deadline: new Date("2026-10-10T23:59:59Z"),
      description: "Hands-on policy research analyzing digital services taxation, gig worker protections, and AI governance in Kenya.",
      stipend: "Ksh 45,000 / month",
      applyUrl: "/my-nybf",
      createdBy: coordinatorUser.id,
    },
    {
      id: "opp-4",
      title: "Youth Public Procurement (AGPO) Capacity Bootcamp",
      type: OpportunityType.PROGRAMME,
      location: "Nairobi, Mombasa, Kisumu & Virtual",
      deadline: new Date("2026-11-12T23:59:59Z"),
      description: "Intensive 4-week certification training on bidding for the mandatory 30% government procurement quota.",
      stipend: "Fully Funded Training",
      applyUrl: "/my-nybf",
      createdBy: adminUser.id,
    },
    {
      id: "opp-5",
      title: "Devolution Budget Monitoring Officer",
      type: OpportunityType.JOB,
      location: "Rift Valley / Western Region",
      deadline: new Date("2026-11-25T23:59:59Z"),
      description: "Full-time position coordinating county youth budget desks, analyzing Annual Development Plans and organizing civic clinics.",
      stipend: "Competitive NGO Scale",
      applyUrl: "/my-nybf",
      createdBy: coordinatorUser.id,
    },
    {
      id: "opp-6",
      title: "Young Women in Fiscal Governance Leadership Cohort",
      type: OpportunityType.PROGRAMME,
      location: "National (47 Counties)",
      deadline: new Date("2026-12-05T23:59:59Z"),
      description: "Leadership accelerator mentoring 100 young Kenyan women to contest and participate in county budget committees.",
      stipend: "Full Travel & Fellowship Grant",
      applyUrl: "/my-nybf",
      createdBy: adminUser.id,
    },
  ];

  for (const opp of opportunities) {
    await prisma.opportunity.create({ data: opp });
  }

  // 4. Events
  const events = [
    {
      id: "evt-1",
      title: "National Youth Budget Town Hall 2026",
      description: "Annual hybrid keynote bringing together 2,000+ youth leaders and the Parliamentary Budget Office to debate national resource allocation.",
      date: new Date("2026-09-12T09:00:00Z"),
      location: "Nairobi (KICC & Online Live-Stream)",
      photo: "/pictures/stage-presentation.jpeg",
      tag: "Hybrid Summit",
      capacity: 500,
      createdBy: adminUser.id,
    },
    {
      id: "evt-2",
      title: "Youth Economic & Public Debt Dialogue",
      description: "Deep dive into Kenya's debt service ratios, Eurobond obligations, and their impact on youth entrepreneurship and taxation.",
      date: new Date("2026-09-26T14:00:00Z"),
      location: "Machakos County Hub",
      photo: "/pictures/roundtable-overhead.jpeg",
      tag: "Regional Roundtable",
      capacity: 100,
      createdBy: adminUser.id,
    },
    {
      id: "evt-3",
      title: "County Youth Budget Forum & Devolution Clinic",
      description: "Grassroots public participation session on County Fiscal Strategy Papers (CFSP) and local bursary governance.",
      date: new Date("2026-10-03T10:00:00Z"),
      location: "Kajiado County Council Hall",
      photo: "/pictures/field-circle.jpeg",
      tag: "Grassroots Circle",
      capacity: 100,
      createdBy: coordinatorUser.id,
    },
    {
      id: "evt-4",
      title: "Digital Economy & Youth TVET Funding Forum",
      description: "Examining digital taxes, freelancing incentives, and public investments in constituency tech hubs and TVET centers.",
      date: new Date("2026-10-18T11:00:00Z"),
      location: "Mombasa Youth Center & Virtual",
      photo: "/pictures/panel-speech.jpeg",
      tag: "Policy Panel",
      capacity: 150,
      createdBy: adminUser.id,
    },
    {
      id: "evt-5",
      title: "Western Kenya Youth Agriculture & AGPO Summit",
      description: "Accessing the 30% Youth Public Procurement Quota (AGPO) and agricultural financing in the 2026/27 budget.",
      date: new Date("2026-11-05T09:30:00Z"),
      location: "Kisumu City Hall",
      photo: "/pictures/auditorium-crowd.jpeg",
      tag: "Economic Summit",
      capacity: 200,
      createdBy: coordinatorUser.id,
    },
    {
      id: "evt-6",
      title: "National Youth Policy Working Group",
      description: "Final consolidation of youth budget amendments submitted to the Clerk of the National Assembly.",
      date: new Date("2026-11-20T10:00:00Z"),
      location: "Nairobi Central",
      photo: "/pictures/leaders-exterior.jpeg",
      tag: "Delegates Assembly",
      capacity: 80,
      createdBy: adminUser.id,
    },
  ];

  for (const evt of events) {
    await prisma.event.create({ data: evt });
  }

  // Register sample member for Event 1
  await prisma.eventRegistration.create({
    data: {
      userId: memberUser.id,
      eventId: "evt-1",
    },
  });

  // 5. Polls & Options
  const poll1 = await prisma.poll.create({
    data: {
      id: "poll-1",
      question: "Which fiscal priority should receive the highest increase in the FY 2026/27 Budget?",
      category: "Macro Spending Priority",
      active: true,
      resultsVisible: true,
      options: {
        create: [
          { label: "Job creation & MSME startup grants (Hustler Fund reform)" },
          { label: "Higher Education Loan Board (HELB) & free TVET capitation" },
          { label: "Digital economy tax relief & local tech infrastructure" },
          { label: "County healthcare facilities & youth mental health clinics" },
        ],
      },
    },
    include: { options: true },
  });

  const poll2 = await prisma.poll.create({
    data: {
      id: "poll-2",
      question: "How should the Government fund university education and TVET colleges?",
      category: "Higher Education Financing",
      active: true,
      resultsVisible: true,
      options: {
        create: [
          { label: "100% state scholarship for vulnerable and low-income students" },
          { label: "Income-contingent loans with zero interest until formal employment" },
          { label: "Public-private partnerships and corporate education levies" },
        ],
      },
    },
    include: { options: true },
  });

  const poll3 = await prisma.poll.create({
    data: {
      id: "poll-3",
      question: "What is your biggest concern regarding County Government resource allocation?",
      category: "Devolution Governance",
      active: true,
      resultsVisible: true,
      options: {
        create: [
          { label: "Lack of transparency in county bursary distributions" },
          { label: "Non-compliance with the 30% AGPO youth procurement quota" },
          { label: "Stalled ward development projects and pending bills" },
        ],
      },
    },
    include: { options: true },
  });

  // Cast sample votes
  // Member votes in Poll 1 for option 2 (HELB)
  await prisma.vote.create({
    data: {
      userId: memberUser.id,
      pollId: poll1.id,
      pollOptionId: poll1.options[1].id,
    },
  });

  // Additional mock votes from the other members
  const allUsers = await prisma.user.findMany();
  for (let i = 0; i < allUsers.length; i++) {
    const u = allUsers[i];
    if (u.id !== memberUser.id) {
      await prisma.vote.create({
        data: {
          userId: u.id,
          pollId: poll1.id,
          pollOptionId: poll1.options[i % poll1.options.length].id,
        },
      });
      await prisma.vote.create({
        data: {
          userId: u.id,
          pollId: poll2.id,
          pollOptionId: poll2.options[i % poll2.options.length].id,
        },
      });
    }
  }

  // 6. Ideas
  const idea1 = await prisma.idea.create({
    data: {
      userId: memberUser.id,
      title: "Mandatory 5-year tax holiday for youth climate tech startups",
      description: "Exempt registered youth-led green technology and renewable energy enterprises from turnover tax and corporate income tax for the first 5 fiscal years to spur job creation.",
      category: "Taxation & Living Costs",
      status: IdeaStatus.APPROVED,
      adminResponse: "Adopted into the 2026 Legislative Memorandum submitted to the National Assembly Departmental Committee on Finance and Planning.",
    },
  });

  const idea2 = await prisma.idea.create({
    data: {
      userId: coordinatorUser.id,
      title: "100% state scholarship funding for orphaned & vulnerable TVET trainees",
      description: "Direct full tuition grants from the National Consolidated Fund to ensure every vulnerable youth completes a certified artisan vocational course.",
      category: "TVET & Higher Ed Funding",
      status: IdeaStatus.PENDING,
    },
  });

  const idea3 = await prisma.idea.create({
    data: {
      userId: memberUser.id,
      title: "Real-time SMS tracking for county bursary disbursements",
      description: "County treasuries must integrate SMS confirmations to applicants whenever ward bursary checks are drawn and disbursed to schools.",
      category: "Devolution & County Bursaries",
      status: IdeaStatus.PENDING,
    },
  });

  const idea4 = await prisma.idea.create({
    data: {
      userId: adminUser.id,
      title: "Dedicated 5% youth digital freelancing procurement quota in parastatals",
      description: "All state corporations and ministries must outsource at least 5% of their creative, digital, and software support to registered youth freelancers.",
      category: "Digital & AI Jobs",
      status: IdeaStatus.APPROVED,
      adminResponse: "Approved by Secretariat for inclusion in the AGPO Policy Reform Brief.",
    },
  });

  // 7. Poll Categories
  const categories = [
    "National Fiscal Policy",
    "Devolution & County Budgets",
    "Youth Employment & TVET",
    "Digital Economy & Taxation",
    "Climate Finance & Agriculture",
  ];
  for (const catName of categories) {
    await prisma.pollCategory.create({
      data: { name: catName },
    });
  }

  // 8. Media Items
  await prisma.mediaItem.create({
    data: {
      title: "Decoding the Finance Act 2026: What Changed for Youth and Tech Freelancers?",
      type: MediaType.ARTICLE,
      thumbnail: "/pictures/roundtable-overhead.jpeg",
      author: "NYBF Policy Research Desk",
      tag: "Policy Analysis",
      summary: "A line-by-line review of the gazetted Finance Act, detailing digital services tax exemptions and the reformed TVET training capitation fund.",
      body: `### 1. Executive Summary\nThe enacted Finance Act contains critical fiscal policy adjustments directly impacting Kenya's informal economy and youth-led technology startups. Following public memorandums submitted during parliamentary committee hearings, key concessions were secured for digital workers and early-stage entrepreneurs.\n\n### 2. Key Legislative Highlights\n- **Digital Economy Withholding Tax Exemptions:** Micro-freelancers earning below statutory thresholds are shielded from aggressive turnover deductions.\n- **TVET Capitation Ringfencing:** Mandatory budgetary transfers to public vocational institutions must now be disbursed directly within 30 days of exchequer release.\n- **Green Enterprise Incentives:** Solar assembly, battery equipment, and climate-smart irrigation machinery retain zero-rated Value Added Tax (VAT) treatment.\n\n### 3. Recommended Citizen Action\nYoung citizens are encouraged to monitor local County Assembly budget committees and report irregularities in bursary or enterprise fund disbursements to the NYBF Devolution Desk.`,
    },
  });

  await prisma.mediaItem.create({
    data: {
      title: "Kenya's Public Debt Dilemma: Why Debt Servicing Exceeds 60% of Ordinary Revenue",
      type: MediaType.ARTICLE,
      thumbnail: "/pictures/shillings-fan.jpeg",
      author: "NYBF Economics & Fiscal Desk",
      tag: "Macroeconomics",
      summary: "Analyzing the amortization schedule of Kenya's Eurobond obligations and their direct squeeze on county equitable share disbursements.",
      body: `### 1. The Fiscal Reality\nKenya's public debt portfolio has reached levels where debt servicing absorbs over 60% of ordinary tax revenue. This historic burden limits the state's capacity to finance development projects, TVET bursaries, and youth economic stimulus programs.\n\n### 2. Composition of National Debt Obligations\n- **Domestic Treasury Debt:** High local borrowing yields create aggressive debt servicing obligations that crowd out private sector credit.\n- **Eurobonds & Commercial Debt:** Foreign-currency-denominated debt increases vulnerability to exchange rate fluctuations.\n- **Multilateral Concessional Financing:** Facilities from the World Bank and IMF provide lower coupon rates but require strict fiscal compliance.\n\n### 3. Policy Interventions Submitted to Parliament\nNYBF has petitioned the Parliamentary Budget Office to mandate that debt sustainability audits accompany all annual Division of Revenue Bills.`,
    },
  });

  await prisma.mediaItem.create({
    data: {
      title: "Townhall Broadcast: Youth Priorities for the Medium Term Expenditure Framework",
      type: MediaType.VIDEO,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "/pictures/stage-presentation.jpeg",
      location: "KICC Amphitheatre, Nairobi",
      tag: "National Keynote",
      summary: "Full recording of the keynote plenary with Parliamentary Budget Office analysts and delegates from 47 counties.",
    },
  });

  await prisma.mediaItem.create({
    data: {
      title: "The Youth Exchequer Ep. 14: How County Assemblies Allocate Ward Development Funds",
      type: MediaType.PODCAST,
      author: "Dr. Evans Kiprop (Lead Devolution Fellow)",
      thumbnail: "/pictures/panel-speech.jpeg",
      tag: "Audio Episode",
      summary: "Demystifying the County Fiscal Strategy Paper (CFSP) and how youth groups can audit ward bursary allocations.",
    },
  });

  // 9. Constituency Dialogue Event Request
  await prisma.eventRequest.create({
    data: {
      userId: memberUser.id,
      name: "Christine Mutheu",
      email: "mutheu@nybf.ke",
      phone: "+254 722 000 111",
      county: "Machakos",
      constituency: "Machakos Town",
      title: "Machakos Youth Agricultural Budget & AGPO Clinic",
      description: "Gathering 60 young agripreneurs to review the Machakos County Fiscal Strategy Paper and petition for agricultural value-addition grants.",
      proposedDate: new Date("2026-10-15T09:00:00Z"),
      status: "PENDING",
    },
  });

  // 10. AuditLog for admin moderation action
  await prisma.auditLog.create({
    data: {
      actorId: adminUser.id,
      action: "IDEA_APPROVED",
      targetId: idea1.id,
      metadata: { previousStatus: "PENDING", newStatus: "APPROVED" },
    },
  });

  console.log("Database seeded successfully with complete authentic data.");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
