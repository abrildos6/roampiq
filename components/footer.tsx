export function Footer() {
    return (
      <footer className="bg-background border-t border-border px-4 py-8 sm:px-6 sm:py-10 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ROAM. All rights reserved.
          </p>
        </div>
      </footer>
    )
  }