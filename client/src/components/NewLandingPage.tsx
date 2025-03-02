import { Link } from "react-router-dom";
import {
  BookOpen,
  BrainCircuit,
  CheckCircle,
  ChevronRight,
  Code,
  Edit3,
  FileText,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewLandingPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="h-6 w-6" />
            <span className="text-xl font-bold">CollabEdit</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:underline underline-offset-4">
              Log in
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Collaborative Editing Powered by AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Write, edit, and collaborate in real-time with AI-powered suggestions that help your team create
                    better content faster.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg">
                    Start for free
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    See it in action
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>14-day free trial</span>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted lg:aspect-square">
                <img
                  src="/placeholder.svg"
                  alt="Screenshot of the collaborative editor interface"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 flex items-end p-6">
                  <div className="rounded-lg bg-background/90 backdrop-blur-sm p-4 w-full max-w-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">AI Suggestion</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Consider rephrasing this paragraph to improve clarity and engagement. Click to apply.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything you need to create amazing content
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform combines real-time collaboration with powerful AI tools to help your team work smarter,
                  not harder.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Real-time Collaboration</h3>
                <p className="text-center text-muted-foreground">
                  Work together with your team in real-time, seeing changes as they happen.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Suggestions</h3>
                <p className="text-center text-muted-foreground">
                  Get intelligent suggestions to improve your writing style, clarity, and impact.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Content Generation</h3>
                <p className="text-center text-muted-foreground">
                  Generate drafts, outlines, and ideas with our advanced AI assistant.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Contextual Comments</h3>
                <p className="text-center text-muted-foreground">
                  Leave comments and feedback directly in the document for seamless review.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Version History</h3>
                <p className="text-center text-muted-foreground">
                  Track changes and revert to previous versions with comprehensive history.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Markdown Support</h3>
                <p className="text-center text-muted-foreground">
                  Write in Markdown or rich text with seamless switching between formats.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Seamless collaboration with AI assistance
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes it easy to work together while leveraging the power of AI to enhance your content.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2">
              <img
                src="/placeholder.svg"
                alt="Collaborative editing in action"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          1
                        </div>
                        <h3 className="text-xl font-bold">Create or join a document</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Start a new document or collaborate on an existing one with a simple invite link.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          2
                        </div>
                        <h3 className="text-xl font-bold">Edit in real-time</h3>
                      </div>
                      <p className="text-muted-foreground">
                        See changes as they happen and work together with your team seamlessly.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          3
                        </div>
                        <h3 className="text-xl font-bold">Activate AI assistance</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Get suggestions for improvements or generate content with our AI tools.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          4
                        </div>
                        <h3 className="text-xl font-bold">Review and publish</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Export your polished content or publish directly to your preferred platform.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="ai-features" className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                    AI-Powered
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Enhance your writing with generative AI
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our AI tools help you write better, faster, and with more confidence.
                  </p>
                </div>
                <ul className="grid gap-4">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-bold">Smart Suggestions</h3>
                      <p className="text-muted-foreground">
                        Get real-time suggestions for improving clarity, tone, and impact.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-bold">Content Generation</h3>
                      <p className="text-muted-foreground">
                        Generate outlines, paragraphs, or entire sections based on your prompts.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-bold">Style Adaptation</h3>
                      <p className="text-muted-foreground">
                        Adjust your writing to match specific tones, styles, or brand guidelines.
                      </p>
                    </div>
                  </li>
                </ul>
                <div>
                  <Button size="lg" className="mt-4">
                    Try AI features
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl border bg-background lg:aspect-square">
                <img
                  src="/placeholder.svg"
                  alt="AI writing assistant in action"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 flex items-end p-6">
                  <div className="space-y-4 w-full">
                    <div className="rounded-lg bg-background/90 backdrop-blur-sm p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Wand2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Generate Content</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Write an introduction paragraph about collaborative editing tools.
                      </p>
                      <Button size="sm" variant="secondary">
                        Generate
                      </Button>
                    </div>
                    <div className="rounded-lg bg-background/90 backdrop-blur-sm p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">AI Suggestion</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This sentence could be more concise. Click to see a suggested revision.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, transparent pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that's right for you and your team.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col rounded-lg border bg-background p-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <p className="text-muted-foreground">For individuals and small projects</p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Up to 3 documents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Basic collaboration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Limited AI suggestions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>7-day version history</span>
                  </li>
                </ul>
                <Button className="mt-8" variant="outline">
                  Get started
                </Button>
              </div>
              <div className="flex flex-col rounded-lg border bg-background p-6 shadow-lg ring-2 ring-primary">
                <div className="space-y-2">
                  <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-muted-foreground">For professionals and teams</p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$12</span>
                  <span className="ml-1 text-muted-foreground">/month per user</span>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Unlimited documents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Advanced collaboration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Full AI features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>30-day version history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="mt-8">Get started</Button>
              </div>
              <div className="flex flex-col rounded-lg border bg-background p-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <p className="text-muted-foreground">For organizations with advanced needs</p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Custom AI training</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Advanced security</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Unlimited version history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>SSO & advanced admin</span>
                  </li>
                </ul>
                <Button className="mt-8" variant="outline">
                  Contact sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Loved by teams worldwide</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our customers have to say about CollabEdit.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col rounded-lg border bg-background p-6">
                <div className="flex items-center gap-4">
                  <img
                    src="/placeholder.svg"
                    alt="User avatar"
                    className="rounded-full h-12 w-12"
                  />
                  <div>
                    <h4 className="font-bold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Content Manager, TechCorp</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "CollabEdit has transformed how our content team works. The AI suggestions have improved our writing
                  quality and cut editing time in half."
                </p>
              </div>
              <div className="flex flex-col rounded-lg border bg-background p-6">
                <div className="flex items-center gap-4">
                  <img
                    src="/placeholder.svg"
                    alt="User avatar"
                    className="rounded-full h-12 w-12"
                  />
                  <div>
                    <h4 className="font-bold">Michael Chen</h4>
                    <p className="text-sm text-muted-foreground">Technical Writer, DevStudio</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "The real-time collaboration features are seamless, and the AI content generation helps us create
                  technical documentation faster than ever before."
                </p>
              </div>
              <div className="flex flex-col rounded-lg border bg-background p-6">
                <div className="flex items-center gap-4">
                  <img
                    src="/placeholder.svg"
                    alt="User avatar"
                    className="rounded-full h-12 w-12"
                  />
                  <div>
                    <h4 className="font-bold">Emily Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">Marketing Director, GrowthLabs</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "Our marketing team relies on CollabEdit daily. The AI suggestions help us maintain consistent brand
                  voice across all our content."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to transform your content creation?
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Join thousands of teams already using CollabEdit to collaborate and create better content with AI
                  assistance.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg">Start your free trial</Button>
                  <Button size="lg" variant="outline">
                    Schedule a demo
                  </Button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-4 -left-4 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
                  <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
                  <div className="relative rounded-xl border bg-background p-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Get started today</h3>
                      <p className="text-muted-foreground">
                        Enter your email to create your account and start your free trial.
                      </p>
                      <div className="space-y-2">
                        <Input type="email" placeholder="Enter your email" />
                        <Button className="w-full">Sign up free</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        By signing up, you agree to our{" "}
                        <a href="#" className="underline underline-offset-2">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline underline-offset-2">
                          Privacy Policy
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Edit3 className="h-6 w-6" />
            <span className="text-lg font-bold">CollabEdit</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} CollabEdit. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;