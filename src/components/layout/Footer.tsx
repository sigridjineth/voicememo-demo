import { Github, Twitter, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Clova Note</h3>
            <p className="text-sm text-muted-foreground">
              Transform your voice into organized, searchable notes with AI-powered transcription.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Product</h4>
            <nav className="space-y-2">
              <a href="/features" className="block text-sm text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="/pricing" className="block text-sm text-muted-foreground hover:text-foreground">
                Pricing
              </a>
              <a href="/changelog" className="block text-sm text-muted-foreground hover:text-foreground">
                Changelog
              </a>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Support</h4>
            <nav className="space-y-2">
              <a href="/docs" className="block text-sm text-muted-foreground hover:text-foreground">
                Documentation
              </a>
              <a href="/help" className="block text-sm text-muted-foreground hover:text-foreground">
                Help Center
              </a>
              <a href="/contact" className="block text-sm text-muted-foreground hover:text-foreground">
                Contact Us
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <nav className="space-y-2">
              <a href="/privacy" className="block text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="/terms" className="block text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="/cookies" className="block text-sm text-muted-foreground hover:text-foreground">
                Cookie Policy
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {currentYear} Clova Note. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="mailto:support@clovanote.com"
                className="text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Made with love */}
          <div className="mt-4 flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 fill-current text-red-500" />
            <span>using Vertex AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}