import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Target, PiggyBank, Upload, Sparkles, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">PRISM</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-accent transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm hover:text-accent transition-colors">How It Works</a>
            <Link to="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            Your Money, Decoded
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            AI-powered insights. Smart rewards. Real savings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/upload">
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                Upload Bank Statement
                <Upload className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              See How It Works
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          
          {/* Floating Elements */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="animate-float" style={{ animationDelay: '0s' }}>
              <div className="glass rounded-2xl p-6">
                <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Smart Analysis</p>
              </div>
            </div>
            <div className="animate-float" style={{ animationDelay: '0.3s' }}>
              <div className="glass rounded-2xl p-6">
                <Award className="w-8 h-8 text-gold mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Earn Rewards</p>
              </div>
            </div>
            <div className="animate-float" style={{ animationDelay: '0.6s' }}>
              <div className="glass rounded-2xl p-6">
                <PiggyBank className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Build Savings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-3xl p-8 border border-border hover-lift">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Intelligent Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upload your bank CSV. Our AI categorizes every transaction and finds money leaks you didn't know existed.
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 border border-border hover-lift">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Earn Rewards</h3>
            <p className="text-muted-foreground leading-relaxed">
              Complete personalized challenges. Build streaks. Unlock premium perks from Bronze to Platinum tier.
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 border border-border hover-lift">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-6">
              <PiggyBank className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Visual Savings</h3>
            <p className="text-muted-foreground leading-relaxed">
              Watch your savings grow in a beautiful 3D pot. Set goals. Celebrate wins. Make saving satisfying.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="relative">
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-bold mb-2">Upload</h4>
              <p className="text-sm text-muted-foreground">Upload your bank statement CSV</p>
            </div>
            <div className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-full -translate-y-1/2" />
          </div>

          <div className="relative">
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <Brain className="w-12 h-12 text-accent mx-auto mb-4" />
              <h4 className="font-bold mb-2">Analyze</h4>
              <p className="text-sm text-muted-foreground">AI categorizes & finds insights</p>
            </div>
            <div className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-full -translate-y-1/2" />
          </div>

          <div className="relative">
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <Target className="w-12 h-12 text-success mx-auto mb-4" />
              <h4 className="font-bold mb-2">Challenge</h4>
              <p className="text-sm text-muted-foreground">Complete personalized goals</p>
            </div>
            <div className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-full -translate-y-1/2" />
          </div>

          <div>
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <Award className="w-12 h-12 text-gold mx-auto mb-4" />
              <h4 className="font-bold mb-2">Reward</h4>
              <p className="text-sm text-muted-foreground">Unlock premium perks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-6 py-20">
        <div className="glass rounded-3xl p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2 font-mono">2,847</div>
              <p className="text-muted-foreground">Students Saving Smarter</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gold mb-2 font-mono">£234,567</div>
              <p className="text-muted-foreground">Saved Collectively</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">4.9★</div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Saving Today</h2>
        <p className="text-xl text-muted-foreground mb-8">Join thousands of students taking control of their finances</p>
        <Link to="/upload">
          <Button size="lg" className="text-lg px-12 py-6 bg-primary hover:bg-primary/90 animate-glow">
            Upload Your First Statement
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              <span className="font-bold">PRISM</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 PRISM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
