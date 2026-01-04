import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-card-foreground">PixelGlow</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered image generation platform
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@pixelglow.app"
                  className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/pixelglow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
                >
                  Join Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} PixelGlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
