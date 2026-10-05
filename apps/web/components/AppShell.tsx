"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CircleDollarSign, CreditCard, FilePlus2, HandCoins, LayoutDashboard, Menu, Search, Settings, ShieldCheck, TrendingUp, Users, WalletCards } from "lucide-react";
import { useState } from "react";

const nav = [
  ["/","Dashboard",LayoutDashboard],["/borrowers","Borrowers",Users],["/applications","Applications",FilePlus2],
  ["/loans","Loans",WalletCards],["/payments","Payments",CreditCard],["/collections","Collections",HandCoins],
  ["/products","Loan Products",CircleDollarSign],["/reports","Reports",TrendingUp],["/audit","Audit Trail",ShieldCheck],["/settings","Settings",Settings]
] as const;

export default function AppShell({children}:{children:React.ReactNode}) {
 const pathname=usePathname(); const [open,setOpen]=useState(false);
 return <main className="shell">
  <aside className={`sidebar ${open?"open":""}`}>
   <div className="brand"><div className="mark"><span>A</span><b>B</b><span>C</span></div><div><strong>ABC</strong><small>Loan Management</small></div></div>
   <nav>{nav.map(([href,label,Icon],i)=><Link key={href} href={href} onClick={()=>setOpen(false)} className={pathname===href?"active":""}><Icon size={19}/>{label}{i===2&&<i>7</i>}</Link>)}</nav>
   <div className="side-footer"><span className="live-dot"/> System operational<small>ABC Platform · v0.2</small></div>
  </aside>
  <section className="workspace">
   <header><button className="menu" onClick={()=>setOpen(!open)}><Menu/></button>
    <div className="search"><Search size={18}/><input placeholder="Search borrowers, loans, payments..."/></div>
    <div className="header-actions"><button className="icon-btn"><Bell size={19}/><span/></button><div className="profile"><div className="avatar">JS</div><div><strong>Jonathan</strong><small>Administrator</small></div></div></div>
   </header>
   {children}
  </section>
 </main>
}
