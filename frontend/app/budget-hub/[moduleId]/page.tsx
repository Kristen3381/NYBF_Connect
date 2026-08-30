import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, BookOpen, Share2, Sparkles, ShieldCheck, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FooterColumn } from "@/components/ui-blocks";
import { ModuleCompleteButton } from "./complete-button";

export const revalidate = 300;

const fallbackModulesMap: Record<string, any> = {
  "mod-1": {
    id: "mod-1",
    title: "Understanding Kenya's National Budget Architecture",
    description: "Learn how the National Treasury plans revenue estimates, borrows public debt, and allocates resources to national priorities and 47 county governments.",
    order: 1,
    duration: "15 min read",
    difficulty: "Beginner",
    contentBody: `
### 1. Where Does Kenya's Money Come From?
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
- **Devolution is Your Immediate Battlefield:** More than Ksh 400 Billion is disbursed directly to counties every year. Your local MCA and County Executive Committee (CEC) for Finance decide bursaries and ward projects.
    `,
  },
  "mod-2": {
    id: "mod-2",
    title: "The National & Devolved Budget Cycle (Formulation to Audit)",
    description: "Step-by-step citizen guide to the 4 phases: Formulation (Treasury/BROP), Approval (Parliament/Budget Committee), Execution (MDAs), and Oversight (Auditor-General).",
    order: 2,
    duration: "20 min read",
    difficulty: "Intermediate",
    contentBody: `
### The 4 Stages of the Kenyan Budget Calendar

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
- The **Auditor-General** audits all accounts and publishes reports exposed before the Public Accounts Committee (PAC) and Senate Public Accounts Committee (CPAC).
    `,
  },
  "mod-3": {
    id: "mod-3",
    title: "Youth Economic Planning & Access to Public Procurement (AGPO)",
    description: "Discover where young Kenyans fit into national economic planning and how to legally leverage the mandatory 30% AGPO youth procurement reservation.",
    order: 3,
    duration: "18 min read",
    difficulty: "Practical Guide",
    contentBody: `
### Demystifying the 30% AGPO Quota for Youth

Under the **Public Procurement and Asset Disposal Act (2015)** and National Treasury regulations, at least **30% of all public procurement tenders** at both National and County levels are reserved exclusively for Youth (aged 18–35), Women, and Persons with Disabilities (PWDs).

#### How to Participate:
1. **Business Registration:** Register an enterprise (Business Name, Company, or Partnership) via the eCitizen Business Registration Service (BRS).
2. **KRA Compliance:** Obtain a Tax Compliance Certificate (TCC).
3. **AGPO Certificate:** Apply for an AGPO Certificate online at agpo.go.ke (valid for 2 years).
4. **Bidding:** Monitor the Public Procurement Information Portal (tenders.go.ke) and local County Procurement portals for reserved youth tenders.
    `,
  },
  "mod-4": {
    id: "mod-4",
    title: "Taxation, the Finance Bill & Citizen Economic Rights",
    description: "Demystifying direct vs. indirect taxes, VAT, fuel levies, housing levies, and how youth memorandums can amend regressive tax proposals in Parliament.",
    order: 4,
    duration: "22 min read",
    difficulty: "Advanced",
    contentBody: `
### Understanding the Annual Finance Bill

The **Finance Bill** is the annual legislation presented by the Executive (through the Cabinet Secretary for the National Treasury) outlining the taxation measures and revenue collection instruments for the upcoming fiscal year.

#### Key Citizen Touchpoints:
- **Publication (April/May):** The Finance Bill is formally published in the Kenya Gazette and read in the National Assembly.
- **Departmental Committee Public Hearings:** The Finance & Planning Committee invites written memorandums and oral submissions from the public.
- **Debate & Clause-by-Clause Voting:** Members of Parliament vote on specific amendments (e.g. VAT exemptions, excise duty rates).
- **Presidential Assent (June):** Signed into law as the **Finance Act**.
    `,
  },
};

// Aliases for sitemap routes
fallbackModulesMap["understanding"] = fallbackModulesMap["mod-1"];
fallbackModulesMap["understanding-the-budget"] = fallbackModulesMap["mod-1"];
fallbackModulesMap["cycle"] = fallbackModulesMap["mod-2"];
fallbackModulesMap["budget-cycle"] = fallbackModulesMap["mod-2"];
fallbackModulesMap["planning"] = fallbackModulesMap["mod-3"];
fallbackModulesMap["economic-planning"] = fallbackModulesMap["mod-3"];
fallbackModulesMap["finance-bills"] = fallbackModulesMap["mod-4"];
fallbackModulesMap["taxation"] = fallbackModulesMap["mod-4"];

export default async function ModuleDetailPage({
  params,
}: {
  params: { moduleId: string };
}) {
  let moduleData: any = null;

  try {
    const dbModule = await prisma.budgetModule.findUnique({
      where: { id: params.moduleId },
    });
    if (dbModule) {
      moduleData = {
        ...dbModule,
        duration: "15 min read",
        difficulty: "Curated Module",
      };
    } else {
      moduleData = fallbackModulesMap[params.moduleId] || fallbackModulesMap["mod-1"];
    }
  } catch {
    moduleData = fallbackModulesMap[params.moduleId] || fallbackModulesMap["mod-1"];
  }

  return (
    <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
      <Nav />

      {/* Module Header Bar */}
      <section className="border-b border-line bg-brand-dark py-12 text-white sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/budget-hub"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={15} />
            <span>Back to Budget Hub</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-xl bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-300 border border-emerald-500/30">
              MODULE {String(moduleData.order || 1).padStart(2, "0")}
            </span>
            <span className="flex items-center gap-1 text-xs text-white/70">
              <Clock size={13} />
              {moduleData.duration || "15 min read"}
            </span>
          </div>

          <h1 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {moduleData.title}
          </h1>

          <p className="mt-4 text-base text-white/80 sm:text-lg leading-relaxed">
            {moduleData.description}
          </p>
        </div>
      </section>

      {/* Content Body */}
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-12 shadow-sm leading-relaxed">
          <div className="prose prose-slate dark:prose-invert max-w-none text-ink text-sm sm:text-base space-y-6">
            {moduleData.contentBody ? (
              <div className="whitespace-pre-line leading-relaxed font-sans text-ink">
                {moduleData.contentBody}
              </div>
            ) : (
              <div className="space-y-4">
                <p>
                  Kenya&apos;s national budget represents the single largest allocation of public resources in East Africa. Understanding where these funds originate and how they are monitored is essential for any active citizen.
                </p>
                <p>
                  Under Article 201 of the Constitution of Kenya, public finance principles mandate openness, accountability, and active public participation in all financial matters.
                </p>
              </div>
            )}
          </div>

          {/* Interactive Complete Button */}
          <div className="mt-12 border-t border-line pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <ModuleCompleteButton moduleId={moduleData.id} />

            <Link
              href="/budget-hub"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted hover:text-brand transition-colors"
            >
              <span>Explore Next Module</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-brand-dark text-white border-t border-white/10 mt-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight text-white">
              NYBF <span className="text-xs uppercase font-sans tracking-widest text-brand-gold">Connect</span>
            </div>
            <p className="mt-3 text-xs text-white/70">
              National Youth Budget Forum — Making Kenya&apos;s budget accessible to every young citizen.
            </p>
          </div>
          <FooterColumn
            title="Platform"
            links={[
              { label: "Budget Hub", href: "/budget-hub" },
              { label: "Youth Voice", href: "/youth-voice" },
              { label: "Opportunities", href: "/opportunities" },
              { label: "Events", href: "/events" },
            ]}
          />
          <FooterColumn
            title="47 Counties"
            links={[
              { label: "Nairobi Hub", href: "/events" },
              { label: "Coast Chapter", href: "/events" },
              { label: "Rift Valley Chapter", href: "/events" },
            ]}
          />
          <FooterColumn
            title="Governance"
            links={[
              { label: "About NYBF", href: "/#about" },
              { label: "Constitution Art. 201", href: "https://kenyalaw.org" },
            ]}
          />
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
          © 2026 National Youth Budget Forum.
        </div>
      </footer>
    </main>
  );
}
