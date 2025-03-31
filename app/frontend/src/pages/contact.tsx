import Header from "@/components/Header";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-6">
        <div className="max-w-4xl mx-auto mt-10">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg mb-2">
            📧 Email: <a href="mailto:support@travelgenie.ai" className="text-blue-600 underline">support@travelgenie.ai</a>
          </p>
          <p className="text-muted-foreground text-lg">
            💻 GitHub: <a href="https://github.com/yourusername/travelgenie" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">github.com/yourusername/travelgenie</a>
          </p>
        </div>
      </main>
      <footer className="py-6 border-t bg-muted/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TravelGenie AI-Agent. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Contact;
