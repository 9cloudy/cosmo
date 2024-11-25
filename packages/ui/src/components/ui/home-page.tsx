"use client";


import { ArrowRight, MessageSquare, UserPlus, Users, Zap } from "lucide-react";
import { Button } from "./button";
import { useSession } from "next-auth/react";
import { useToast } from "@repo/ui/hooks/use-toast";
import { Card, CardContent } from "./card";

export default function Homepage() {
  const session = useSession();
  const {toast} = useToast();
  function redirect(){
    
    if(session.status = "unauthenticated") return toast({
      title:"please sign in or create account"
    })
    window.location.href = "/find";
  }
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundPosition: "0 0",
          backgroundSize: "100px 100px",
        }}
      />
    </div>
    <main className="relative container mx-auto px-4 py-20 md:py-32">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
          Your complete platform for
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text">
            real-time communication.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
          GoChat provides the tools and infrastructure to build, scale,
          and secure faster, more personalized conversations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={redirect}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-lg px-8"
          >
            <Users className="mr-2 h-5 w-5" />
            Find people
          </Button>
          <Button
            size="lg"
            onClick={()=>window.location.href = "user/create"}
            variant="outline"
            className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg px-8"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Create Account
          </Button>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mt-24 mb-12">Powerful Features for Seamless Communication</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <MessageSquare className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Messaging</h3>
              <p className="text-gray-300">Instant message delivery and synchronization across all devices.</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <Zap className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Scalable Infrastructure</h3>
              <p className="text-gray-300">Built to handle millions of concurrent connections without breaking a sweat.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mt-24 mb-12">Framework and Tech Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="p-6 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-2 text-blue-400">Next.js</h3>
            <p className="text-gray-300">
              Modern React framework for production-grade applications
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-2 text-indigo-400">WebSocket</h3>
            <p className="text-gray-300">
              Real-time bidirectional communication for instant messaging
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-2 text-purple-400">PostgreSQL</h3>
            <p className="text-gray-300">
              Robust database for reliable data persistence
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-2 text-blue-400">Prisma</h3>
            <p className="text-gray-300">
              Type-safe database client for seamless interactions
            </p>
          </div>
        </div>

        <div className="mt-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your communication?</h2>
          <p className="text-xl mb-8">Join GoChat today.</p>
          <Button onClick={()=>window.location.href = "user/create"} size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </main>
    <footer className="bg-gray-900 text-gray-300 py-2">
      <div className="container mx-auto px-4">
        <div className="my-2 flex justify-center items-center border-t border-gray-800 text-sm text-center">
          © {new Date().getFullYear()} GoChat. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
  );
}
