"use client";

import {
  Bell, ChevronRight, CircleDollarSign, CreditCard, FilePlus2, LayoutDashboard,
  Menu, Search, Settings, ShieldCheck, Users, WalletCards, TrendingUp,
  ArrowUpRight, Banknote, HandCoins, UserPlus, MoreHorizontal
} from "lucide-react";
import { useState } from "react";

const applications = [
  { name: "Chanda Mwila", product: "Business Growth", amount: "K 35,000", status: "Under review", initials: "CM" },
  { name: "Natasha Banda", product: "Salary Advance", amount: "K 8,500", status: "Approved", initials: "NB" },
  { name: "Mwamba Trading", product: "SME Working Capital", amount: "K 72,000", status: "Submitted", initials: "MT" }
];

const payments = [
  { name: "Kelvin Phiri", method: "MTN MoMo", amount: "K 1,250", time: "09:42" },
  { name: "Grace Tembo", method: "Bank transfer", amount: "K 3,800", time: "08:17" },
  { name: "Lusekelo Stores", method: "Cash", amount: "K 2,100", time: "Yesterday" }
];

export default function Dashboard() {
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("");

  const action = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  return (
    <main className="shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand">
          <div className="mark"><span>A</span><b>B</b><span>C</span></div>
          <div><strong>ABC</strong><small>Loan Management</small></div>
        </div>
        <nav>
          <a className="active"><LayoutDashboard size={19}/> Dashboard</a>
          <a><Users size={19}/> Borrowers</a>
          <a><FilePlus2 size={19}/> Applications <i>7</i></a>
          <a><WalletCards size={19}/> Loans</a>
          <a><CreditCard size={19}/> Payments</a>
          <a><HandCoins size={19}/> Collections</a>
          <div className="nav-label">MANAGEMENT</div>
          <a><CircleDollarSign size={19}/> Loan Products</a>
          <a><TrendingUp size={19}/> Reports</a>
          <a><ShieldCheck size={19}/> Audit Trail</a>
          <a><Settings size={19}/> Settings</a>
        </nav>
        <div className="side-footer">
          <span className="live-dot"/> System operational
          <small>ABC Platform · v0.1</small>
        </div>
      </aside>

      <section className="workspace">
        <header>
          <button className="menu" onClick={() => setMobileNav(!mobileNav)}><Menu/></button>
          <div className="search"><Search size={18}/><input placeholder="Search borrowers, loans, payments..."/></div>
          <div className="header-actions">
            <button className="icon-btn"><Bell size={19}/><span/></button>
            <div className="profile"><div className="avatar">JS</div><div><strong>Jonathan</strong><small>Administrator</small></div></div>
          </div>
        </header>

        <div className="content">
          <div className="hero">
            <div>
              <span className="eyebrow">MONDAY · PORTFOLIO OVERVIEW</span>
              <h1>Good afternoon, Jonathan.</h1>
              <p>Here’s what’s happening across your lending portfolio today.</p>
            </div>
            <button className="primary" onClick={() => action("New loan application workspace coming next.")}><FilePlus2 size={18}/> New application</button>
          </div>

          <div className="metrics">
            <Metric title="Active portfolio" value="K 1,284,500" detail="+8.4% this month" icon={<Banknote/>}/>
            <Metric title="Active loans" value="186" detail="14 due this week" icon={<WalletCards/>}/>
            <Metric title="Repayment rate" value="94.7%" detail="+1.2% vs last month" icon={<TrendingUp/>}/>
            <Metric title="Amount overdue" value="K 42,760" detail="18 accounts require action" danger icon={<Bell/>}/>
          </div>

          <div className="grid">
            <section className="card portfolio">
              <CardHead title="Portfolio performance" action="Last 6 months"/>
              <div className="chart-wrap">
                <div className="chart-y"><span>1.4m</span><span>1.0m</span><span>600k</span><span>200k</span></div>
                <div className="chart">
                  <div className="gridline a"/><div className="gridline b"/><div className="gridline c"/>
                  <svg viewBox="0 0 600 180" preserveAspectRatio="none">
                    <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#21e67a" stopOpacity=".28"/><stop offset="1" stopColor="#21e67a" stopOpacity="0"/></linearGradient></defs>
                    <path className="area" d="M0,150 C80,145 95,112 160,118 S260,85 315,90 S410,48 465,58 S545,20 600,28 L600,180 L0,180 Z"/>
                    <path className="line" d="M0,150 C80,145 95,112 160,118 S260,85 315,90 S410,48 465,58 S545,20 600,28"/>
                  </svg>
                </div>
              </div>
              <div className="months"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
            </section>

            <section className="card">
              <CardHead title="Loan status" action="View all"/>
              <div className="donut-row">
                <div className="donut"><div><strong>186</strong><span>Total loans</span></div></div>
                <div className="legend">
                  <Legend dot="green" label="Performing" value="151"/>
                  <Legend dot="blue" label="Due soon" value="17"/>
                  <Legend dot="amber" label="In arrears" value="14"/>
                  <Legend dot="red" label="Critical" value="4"/>
                </div>
              </div>
            </section>
          </div>

          <section className="quick">
            <div><h2>Quick actions</h2><p>Common tasks, one click away.</p></div>
            <div className="quick-actions">
              <Quick icon={<UserPlus/>} label="Add borrower" onClick={() => action("Borrower onboarding is next in the build.")}/>
              <Quick icon={<FilePlus2/>} label="New application" onClick={() => action("Application workflow is next in the build.")}/>
              <Quick icon={<CreditCard/>} label="Record payment" onClick={() => action("Payment workflow will connect to the ledger.")}/>
              <Quick icon={<TrendingUp/>} label="View reports" onClick={() => action("Reporting module is on the roadmap.")}/>
            </div>
          </section>

          <div className="grid lower">
            <section className="card">
              <CardHead title="Recent applications" action="View applications"/>
              <div className="table">
                {applications.map(a => <div className="row" key={a.name}>
                  <div className="person"><div className="mini-avatar">{a.initials}</div><div><strong>{a.name}</strong><small>{a.product}</small></div></div>
                  <strong>{a.amount}</strong>
                  <span className={`pill ${a.status.toLowerCase().replace(" ","-")}`}>{a.status}</span>
                  <MoreHorizontal size={18}/>
                </div>)}
              </div>
            </section>
            <section className="card">
              <CardHead title="Recent payments" action="View payments"/>
              <div className="table">
                {payments.map(p => <div className="row payment" key={p.name}>
                  <div className="person"><div className="pay-icon"><ArrowUpRight size={16}/></div><div><strong>{p.name}</strong><small>{p.method} · {p.time}</small></div></div>
                  <strong className="positive">+ {p.amount}</strong>
                </div>)}
              </div>
            </section>
          </div>

          <footer>© {new Date().getFullYear()} EJ Businesses. All rights reserved. <span>·</span> ABC Loan Management</footer>
        </div>
      </section>
      {notice && <div className="toast">{notice}</div>}
    </main>
  );
}

function Metric({title,value,detail,icon,danger=false}:{title:string,value:string,detail:string,icon:React.ReactNode,danger?:boolean}) {
  return <section className="metric card"><div className={`metric-icon ${danger?"danger":""}`}>{icon}</div><span>{title}</span><strong>{value}</strong><small className={danger?"danger-text":""}>{detail}</small></section>;
}
function CardHead({title,action}:{title:string,action:string}) {
  return <div className="card-head"><h2>{title}</h2><button>{action}<ChevronRight size={15}/></button></div>;
}
function Legend({dot,label,value}:{dot:string,label:string,value:string}) {
  return <div className="legend-item"><span className={`dot ${dot}`}/><span>{label}</span><strong>{value}</strong></div>;
}
function Quick({icon,label,onClick}:{icon:React.ReactNode,label:string,onClick:()=>void}) {
  return <button className="quick-btn" onClick={onClick}><span>{icon}</span>{label}<ChevronRight size={16}/></button>;
}
