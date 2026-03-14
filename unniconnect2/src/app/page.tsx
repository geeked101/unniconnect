import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-white dark:bg-zinc-950 font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-cocoa/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-caramel/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gold/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <span className="text-primary-foreground font-bold text-xl">U</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground font-headline">UnniConnect</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
                    <Link href="/login" className="hover:text-primary transition-colors">Sign In</Link>
                    <Link href="/signup" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                        Join Now
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 px-6 pt-20 pb-16 mx-auto max-w-7xl text-center sm:pt-32">
                <div className="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium text-secondary bg-secondary/10 rounded-full ring-1 ring-inset ring-secondary/20">
                    ✨ Connecting Students Everywhere
                </div>

                <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl font-headline">
                    Your University <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-caramel to-gold">
                        Digital Hub.
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto mt-6 text-lg leading-8 text-muted-foreground">
                    UnniConnect brings your campus life together. Share notes, join events,
                    and connect with peers across all departments in one secure place.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
                    <Link
                        href="/signup"
                        className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-primary-foreground bg-primary rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 active:scale-95"
                    >
                        Create Your Account
                    </Link>
                    <Link
                        href="/login"
                        className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-foreground bg-card border border-border rounded-2xl hover:bg-card/90 transition-all active:scale-95"
                    >
                        Sign In
                    </Link>
                </div>

                {/* Feature Cards Mockup */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
                    {[
                        { title: "Smart Study Groups", desc: "Find peers from your courses and collaborate instantly.", icon: "📚", color: "bg-cocoa/5" },
                        { title: "Campus Events", desc: "Never miss a guest lecture or social gathering again.", icon: "🎉", color: "bg-caramel/5" },
                        { title: "Verified Network", desc: "Connect exclusively with students from your institution.", icon: "✅", color: "bg-gold/5" }
                    ].map((feature, i) => (
                        <div key={i} className={`p-8 rounded-3xl border border-border ${feature.color} text-left transition-transform hover:-translate-y-2`}>
                            <div className="text-3xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-foreground mb-2 font-headline">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="px-6 py-12 mx-auto max-w-7xl border-t border-zinc-100 dark:border-zinc-800 mt-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-sm text-zinc-500">© 2026 UnniConnect. Built by Sensei.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
