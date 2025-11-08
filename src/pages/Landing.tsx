import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Target, PiggyBank, Upload, Sparkles, TrendingUp, Award, Coffee, Car, ShoppingBag, Zap, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Landing = () => {
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);
  
  // Animated count-up effect
  useEffect(() => {
    const balanceTarget = 2847;
    const pointsTarget = 1250;
    const duration = 2000;
    const steps = 60;
    const balanceIncrement = balanceTarget / steps;
    const pointsIncrement = pointsTarget / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setBalance(Math.floor(balanceIncrement * currentStep));
        setPoints(Math.floor(pointsIncrement * currentStep));
      } else {
        clearInterval(interval);
      }
    }, duration / steps);
    
    return () => clearInterval(interval);
  }, []);
  
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
      <section className="container mx-auto px-6 pt-32 pb-20 text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-accent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent leading-tight">
            Your Student Finances.
            <br />Smarter. Rewarded.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            AI-powered insights that help you save, earn, and spend better.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/upload">
              <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover-lift">
                Connect Bank
                <Upload className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/rewards">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-border hover:bg-card transition-all">
                Explore Rewards
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          
          {/* Dynamic Balance & Points Display */}
          <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto mt-16">
            <div className="glass rounded-3xl p-8 hover-lift">
              <p className="text-sm text-muted-foreground mb-2">Your Balance</p>
              <p className="text-4xl font-bold font-mono text-accent">£{balance.toLocaleString()}</p>
              <p className="text-sm text-success mt-2 flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" /> +2.3% this month
              </p>
            </div>
            <div className="glass rounded-3xl p-8 hover-lift">
              <p className="text-sm text-muted-foreground mb-2">Reward Points</p>
              <p className="text-4xl font-bold font-mono text-gold">{points}</p>
              <p className="text-sm text-muted-foreground mt-2">Silver Tier</p>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Dashboard */}
      <section id="insights" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Spending, Simplified.</h2>
          <p className="text-xl text-muted-foreground">AI-powered insights that actually help you save.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Money Leak Card 1 */}
          <div className="bg-gradient-to-br from-card to-card/50 rounded-3xl p-8 border border-border hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Money Leak</p>
                <p className="font-bold">Coffee Shops</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-warning mb-2">£127</p>
            <p className="text-sm text-muted-foreground mb-4">18 transactions this month</p>
            <p className="text-sm text-accent">Save £85/mo by brewing at home</p>
          </div>

          {/* Money Leak Card 2 */}
          <div className="bg-gradient-to-br from-card to-card/50 rounded-3xl p-8 border border-border hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Car className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Money Leak</p>
                <p className="font-bold">Ride Sharing</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-warning mb-2">£94</p>
            <p className="text-sm text-muted-foreground mb-4">40% above student average</p>
            <p className="text-sm text-accent">Try walking once more per week</p>
          </div>

          {/* Money Leak Card 3 */}
          <div className="bg-gradient-to-br from-card to-card/50 rounded-3xl p-8 border border-border hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Money Leak</p>
                <p className="font-bold">Takeaway Food</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-warning mb-2">£156</p>
            <p className="text-sm text-muted-foreground mb-4">23% more than last month</p>
            <p className="text-sm text-accent">Cook 3 meals = save £42/week</p>
          </div>
        </div>

        {/* Comparison Bar */}
        <div className="max-w-4xl mx-auto mt-12 glass rounded-3xl p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-semibold">Your Spending vs. Average Student</p>
            <p className="text-sm text-muted-foreground">Food & Dining</p>
          </div>
          <div className="relative h-12 bg-muted rounded-full overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              <div className="h-full bg-gradient-to-r from-accent to-primary rounded-full" style={{ width: '73%' }}>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold">You: £377</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">Average: £307</p>
            <p className="text-sm text-warning font-semibold">+23% higher</p>
          </div>
        </div>
      </section>

      {/* Smart Challenges */}
      <section id="challenges" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Turn Saving into a Challenge</h2>
          <p className="text-xl text-muted-foreground">Complete goals. Build streaks. Earn rewards.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Challenge Card 1 */}
          <div className="bg-card rounded-3xl p-8 border border-border hover-lift relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-accent" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-accent">+75</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Coffee Challenge</h3>
              <p className="text-sm text-muted-foreground mb-6">You bought coffee 8× last week. Try 5 this week?</p>
              
              {/* Progress Circle */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted" />
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175.84" strokeDashoffset="44" className="text-accent transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">75%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">3 days left</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3 text-accent" /> 3-day streak
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Challenge Card 2 */}
          <div className="bg-card rounded-3xl p-8 border border-border hover-lift relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center">
                  <Car className="w-8 h-8 text-success" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-success">+50</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Walk More Challenge</h3>
              <p className="text-sm text-muted-foreground mb-6">Uber spending 40% above average. Walk once more?</p>
              
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted" />
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175.84" strokeDashoffset="88" className="text-success transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">50%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">5 days left</p>
                  <p className="text-xs text-muted-foreground">New challenge</p>
                </div>
              </div>
            </div>
          </div>

          {/* Challenge Card 3 */}
          <div className="bg-card rounded-3xl p-8 border border-border hover-lift relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center">
                  <Target className="w-8 h-8 text-gold" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gold">+100</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Save £50 This Week</h3>
              <p className="text-sm text-muted-foreground mb-6">Cut unnecessary spending and hit your savings goal.</p>
              
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted" />
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175.84" strokeDashoffset="131.88" className="text-gold transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">25%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">7 days left</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    £12.50 saved so far
                  </p>
                </div>
              </div>
            </div>
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

      {/* Social & Impact */}
      <section id="social" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Together, We Save More</h2>
          <p className="text-xl text-muted-foreground">Join a community of smart savers.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Leaderboard */}
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-gold" />
              <h3 className="text-2xl font-bold">Top Savers This Month</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Alex M.', saved: '£427', rank: 1, tier: 'platinum' },
                { name: 'Sarah K.', saved: '£389', rank: 2, tier: 'gold' },
                { name: 'Jamie L.', saved: '£312', rank: 3, tier: 'gold' },
                { name: 'You', saved: '£234', rank: 12, tier: 'silver' }
              ].map((user, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${user.name === 'You' ? 'bg-accent/10 border border-accent/20' : 'bg-muted/30'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      user.rank === 1 ? 'bg-gold/20 text-gold' :
                      user.rank === 2 ? 'bg-silver/20 text-silver' :
                      user.rank === 3 ? 'bg-bronze/20 text-bronze' : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.tier} tier</p>
                    </div>
                  </div>
                  <p className="font-bold font-mono">{user.saved}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Collective Impact */}
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-accent" />
              <h3 className="text-2xl font-bold">Collective Impact</h3>
            </div>
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">PRISM Community Total</p>
              <p className="text-6xl font-bold font-mono text-accent mb-4">£234,567</p>
              <p className="text-muted-foreground mb-8">saved collectively this year</p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-card rounded-2xl p-4">
                  <p className="text-3xl font-bold text-gold mb-1">2,847</p>
                  <p className="text-sm text-muted-foreground">Active Savers</p>
                </div>
                <div className="bg-card rounded-2xl p-4">
                  <p className="text-3xl font-bold text-primary mb-1">12,459</p>
                  <p className="text-sm text-muted-foreground">Challenges Completed</p>
                </div>
              </div>
            </div>
            
            <Link to="/challenges">
              <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Challenge a Friend
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="glass rounded-3xl p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2 font-mono animate-float">2,847</div>
              <p className="text-muted-foreground">Students Saving Smarter</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gold mb-2 font-mono animate-float" style={{ animationDelay: '0.3s' }}>4.9★</div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono animate-float" style={{ animationDelay: '0.6s' }}>£47</div>
              <p className="text-muted-foreground">Avg. Monthly Savings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Start Saving Smarter Today</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join thousands of students taking control of their finances. No credit card required.
        </p>
        <Link to="/upload">
          <Button size="lg" className="text-lg px-12 py-7 bg-gradient-to-r from-primary to-accent hover:opacity-90 animate-glow hover-lift">
            Upload Your First Statement
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground mt-6">✨ Your data stays private. Always.</p>
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
