import Link from "next/link";
import AppShell from "../components/AppShell";
import {
  AlertTriangle, ArrowUpRight, Banknote, CheckCircle2, ChevronRight, Clock3,
  CreditCard, FileCheck2, FilePlus2, ShieldAlert, TrendingUp, UserPlus, WalletCards
} from "lucide-react";

const attention=[
  {icon:<Clock3/>, title:"Loan decisions", value:"7", detail:"Applications awaiting review", href:"/applications", tone:"amber"},
  {icon:<ShieldAlert/>, title:"Overdue accounts", value:"18", detail:"K 42,760 currently overdue", href:"/collections", tone:"red"},
  {icon:<FileCheck2/>, title:"KYC reviews", value:"5", detail:"Documents need verification", href:"/kyc", tone:"blue"}
];

const activity=[
  ["Loan approved","Natasha Banda · Salary Advance","K 8,500","6 min ago"],
  ["Repayment received","Kelvin Phiri · MTN MoMo","K 1,250","24 min ago"],
  ["Application submitted","Mwamba Trading · SME Working Capital","K 72,000","1 hr ago"],
  ["Promise to pay","Lusekelo Stores · Collections","K 12,000","2 hrs ago"]
];

export default function Dashboard(){
 return <AppShell><div className="content">
  <div className="hero dashboard-hero">
   <div><span className="eyebrow">LENDING OPERATIONS</span><h1>Your portfolio, at a glance.</h1><p>Review risk, approvals, repayments and portfolio health from one workspace.</p></div>
   <Link className="primary" href="/applications"><FilePlus2 size={18}/> Book a loan</Link>
  </div>

  <div className="metrics">
   <Metric title="Outstanding portfolio" value="K 1,284,500" detail="+8.4% this month" icon={<Banknote/>}/>
   <Metric title="Active loans" value="186" detail="14 repayments due this week" icon={<WalletCards/>}/>
   <Metric title="PAR 30" value="3.33%" detail="Portfolio at risk over 30 days" icon={<AlertTriangle/>} warning/>
   <Metric title="Collected today" value="K 28,460" detail="42 successful repayments" icon={<TrendingUp/>}/>
  </div>

  <section className="section-block">
   <div className="section-title"><div><h2>Needs your attention</h2><p>Items that may affect lending operations or portfolio risk.</p></div><Link href="/applications">Review work queue <ChevronRight size={15}/></Link></div>
   <div className="attention-grid">
    {attention.map(a=><Link href={a.href} className="attention-card card" key={a.title}>
      <div className={`attention-icon ${a.tone}`}>{a.icon}</div>
      <div><span>{a.title}</span><strong>{a.value}</strong><small>{a.detail}</small></div>
      <ChevronRight size={17}/>
    </Link>)}
   </div>
  </section>

  <div className="grid mature-grid">
   <section className="card portfolio">
    <div className="card-head"><div><h2>Portfolio performance</h2><small>Outstanding principal · last 6 months</small></div><button>Portfolio report <ChevronRight size={15}/></button></div>
    <div className="chart-wrap">
      <div className="chart-y"><span>1.4m</span><span>1.0m</span><span>600k</span><span>200k</span></div>
      <div className="chart"><div className="gridline a"/><div className="gridline b"/><div className="gridline c"/>
       <svg viewBox="0 0 600 180" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#21e67a" stopOpacity=".28"/><stop offset="1" stopColor="#21e67a" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0,150 C80,145 95,112 160,118 S260,85 315,90 S410,48 465,58 S545,20 600,28 L600,180 L0,180 Z"/><path className="line" d="M0,150 C80,145 95,112 160,118 S260,85 315,90 S410,48 465,58 S545,20 600,28"/></svg>
      </div>
    </div>
    <div className="months"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
   </section>

   <section className="card health-card">
    <div className="card-head"><div><h2>Portfolio health</h2><small>Current loan ageing</small></div></div>
    <div className="donut-row"><div className="donut"><div><strong>94.7%</strong><span>performing</span></div></div>
     <div className="legend"><Legend dot="green" label="Current" value="151"/><Legend dot="blue" label="1–7 days" value="17"/><Legend dot="amber" label="8–30 days" value="12"/><Legend dot="red" label="30+ days" value="6"/></div>
    </div>
   </section>
  </div>

  <section className="quick mature-quick">
   <div><h2>Quick actions</h2><p>Common lending operations.</p></div>
   <div className="quick-actions">
    <Quick href="/borrowers" icon={<UserPlus/>} label="Add customer"/>
    <Quick href="/applications" icon={<FilePlus2/>} label="New loan request"/>
    <Quick href="/payments" icon={<CreditCard/>} label="Record repayment"/>
    <Quick href="/disbursements" icon={<ArrowUpRight/>} label="Disburse funds"/>
   </div>
  </section>

  <div className="grid lower">
   <section className="card activity-card">
    <div className="card-head"><div><h2>Recent activity</h2><small>Latest operational events</small></div></div>
    <div className="activity-list">{activity.map(([title,detail,amount,time])=><div className="activity-item" key={title+detail}><div className="activity-mark"><CheckCircle2 size={16}/></div><div><strong>{title}</strong><small>{detail}</small></div><div className="activity-amount"><strong>{amount}</strong><small>{time}</small></div></div>)}</div>
   </section>

   <section className="card setup-card">
    <div className="card-head"><div><h2>Operational readiness</h2><small>Key controls for a lending business</small></div></div>
    <Setup done label="Loan products configured"/><Setup done label="Branch and organisation profile"/><Setup done label="Core ledger structure"/><Setup label="Approval workflow rules"/><Setup label="Two-factor authentication"/>
    <Link className="text-link" href="/settings">Continue setup <ChevronRight size={14}/></Link>
   </section>
  </div>

  <footer>© {new Date().getFullYear()} EJ Businesses. All rights reserved. <span>·</span> ABC Loan Management</footer>
 </div></AppShell>
}

function Metric({title,value,detail,icon,warning=false}:{title:string,value:string,detail:string,icon:React.ReactNode,warning?:boolean}){return <section className="metric card"><div className={`metric-icon ${warning?"warning":""}`}>{icon}</div><span>{title}</span><strong>{value}</strong><small className={warning?"warning-text":""}>{detail}</small></section>}
function Legend({dot,label,value}:{dot:string,label:string,value:string}){return <div className="legend-item"><span className={`dot ${dot}`}/><span>{label}</span><strong>{value}</strong></div>}
function Quick({href,icon,label}:{href:string,icon:React.ReactNode,label:string}){return <Link className="quick-btn" href={href}><span>{icon}</span>{label}<ChevronRight size={16}/></Link>}
function Setup({done=false,label}:{done?:boolean,label:string}){return <div className="setup-item"><span className={done?"done":""}>{done?<CheckCircle2 size={15}/>:<Clock3 size={15}/>}</span><b>{label}</b></div>}
