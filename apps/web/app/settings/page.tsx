import AppShell from "../../components/AppShell"; import PageHeader from "../../components/PageHeader";
export default function Page(){return <AppShell><div className="content"><PageHeader eyebrow="PLATFORM CONFIGURATION" title="Settings" description="Organisation, security, lending and integration defaults."/><div className="settings-grid">
 <Setting title="Organisation" text="Legal name, trading name, country, base currency and timezone." meta="Zambia · ZMW · Africa/Lusaka"/>
 <Setting title="Security" text="Authentication policy, two-factor authentication and session controls." meta="2FA recommended"/>
 <Setting title="Lending defaults" text="Arrears thresholds, business days, rounding and repayment allocation." meta="Configuration required"/>
 <Setting title="Notifications" text="SMS, email and borrower communication templates." meta="Providers not connected"/>
 <Setting title="Payment integrations" text="MTN MoMo, Airtel Money, bank and card provider adapters." meta="Manual mode"/>
 <Setting title="Branding" text="Customer-facing organisation logo, colours and contact channels." meta="ABC default theme"/>
 </div></div></AppShell>}
function Setting({title,text,meta}:{title:string;text:string;meta:string}){return <section className="card setting-card"><div><h2>{title}</h2><p>{text}</p></div><span>{meta}</span><button>Configure</button></section>}
