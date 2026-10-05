"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, BookOpen, Building2, CircleDollarSign, CreditCard, FileCheck2, FilePlus2,
  HandCoins, Landmark, LayoutDashboard, ListChecks, Menu, Receipt, Search,
  Settings, ShieldCheck, TrendingUp, UserCheck, UserCog, Users, UsersRound, WalletCards
} from "lucide-react";
import { useState } from "react";

const groups = [
  {
    label: "WORKSPACE",
    items: [["/","Home",LayoutDashboard]]
  },
  {
    label: "CUSTOMERS",
    items: [
      ["/borrowers","Borrowers",Users],
      ["/applications","Loan requests",FilePlus2],
      ["/loans","Loans",WalletCards],
      ["/kyc","KYC & Documents",FileCheck2],
      ["/guarantors","Guarantors",UsersRound]
    ]
  },
  {
    label: "BACK OFFICE",
    items: [
      ["/products","Loan products",CircleDollarSign],
      ["/workflows","Approval workflows",ListChecks],
      ["/disbursements","Disbursements",Landmark],
      ["/payments","Repayments",CreditCard],
      ["/transactions","Transactions",Receipt],
      ["/collections","Collections",HandCoins],
      ["/accounting","Accounting",BookOpen],
      ["/reports","Reports",TrendingUp],
      ["/audit","Audit logs",ShieldCheck]
    ]
  },
  {
    label: "ADMINISTRATION",
    items: [
      ["/branches","Branches",Building2],
      ["/team","Team members",UserCog],
      ["/roles","Roles & permissions",UserCheck],
      ["/settings","Settings",Settings]
    ]
  }
] as const;

export default function AppShell({children}:{children:React.ReactNode}) {
  const pathname=usePathname();
  const [open,setOpen]=useState(false);

  return <main className="shell">
    <aside className={`sidebar ${open?"open":""}`}>
      <div className="brand">
        <div className="mark"><span>A</span><b>B</b><span>C</span></div>
        <div><strong>ABC</strong><small>Loan Management</small></div>
      </div>

      <nav className="grouped-nav">
        {groups.map(group=><div className="nav-group" key={group.label}>
          <div className="nav-label">{group.label}</div>
          {group.items.map(([href,label,Icon])=>{
            const active=href==="/" ? pathname==="/" : pathname.startsWith(href);
            return <Link key={href} href={href} onClick={()=>setOpen(false)} className={active?"active":""}>
              <Icon size={18}/><span>{label}</span>
              {href==="/applications"&&<i>7</i>}
            </Link>
          })}
        </div>)}
      </nav>

      <div className="side-footer">
        <span className="live-dot"/> System operational
        <small>ABC Platform · Development</small>
      </div>
    </aside>

    <section className="workspace">
      <header>
        <button className="menu" onClick={()=>setOpen(!open)} aria-label="Toggle navigation"><Menu/></button>
        <div className="search"><Search size={18}/><input placeholder="Search customer, loan, reference..."/></div>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Notifications"><Bell size={19}/><span/></button>
          <div className="profile"><div className="avatar">JS</div><div><strong>Jonathan</strong><small>Administrator</small></div></div>
        </div>
      </header>
      {children}
    </section>
  </main>
}
