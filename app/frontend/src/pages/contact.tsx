import Header from "@/components/Header";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const developers = [
  {
    name: "Rohit Kosamkar",
    title: "Data Scientist | AI Engineer | MLOps",
    description: "Building intelligent, scalable AI-driven systems with a focus on GenAI, pipelines, and production-ready ML.",
    image: "/public/rohit.jpg", // Replace with actual path
    github: "https://github.com/rohit180497",
    linkedin: "https://www.linkedin.com/in/rohitkosamkar",
    email: "kosamkar.r@northeastern.edu",
  },
  {
    name: "Sapna Chavan",
    title: "Web Developer | Data Analyst | Data Engineer | Data Specialist",
    description: "Crafting interactive UIs Dashboards and robust data pipelines. Passionate about analytics, frontend engineering, and automation.",
    image: "/public/sapna.jpeg", // Replace with actual path
    github: "https://github.com/sapna-chavan",
    linkedin: "https://www.linkedin.com/in/sapna-chavan",
    email: "chavan.sap@northeastern.edu",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-6">
        <div className="max-w-4xl mx-auto mt-10">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

          <p className="text-muted-foreground text-lg mb-4">
            {/* 📧 General Email: <a href="mailto:rohitkosamkar97@gmail.com" className="text-blue-600 underline">support@travelgenie.ai</a> */}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {developers.map((dev, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition duration-300 flex flex-col items-center text-center"
              >
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-28 h-28 rounded-full object-cover mb-4"
                />
                <h2 className="text-xl font-semibold">{dev.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{dev.title}</p>
                <p className="text-sm text-muted-foreground mb-3">{dev.description}</p>
                <p className="text-sm text-blue-600 mb-3">
                  <a href={`mailto:${dev.email}`} className="hover:underline">
                    <FaEnvelope className="inline-block mr-1 mb-1" /> {dev.email}
                  </a>
                </p>
                <div className="flex gap-4">
                  <a href={dev.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub size={22} className="text-black hover:text-travel-primary transition" />
                  </a>
                  <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={22} className="text-blue-600 hover:text-travel-primary transition" />
                  </a>
                </div>
              </div>
            ))}
          </div>
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
