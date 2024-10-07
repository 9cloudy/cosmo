"use client";

import { ModeToggle } from "@repo/ui/components/theme-toggle";
import { LoginForm } from "@repo/ui/login-form";


export default function Home() {

  
  return (
    <>
      <div>
        <LoginForm ></LoginForm>
        home
      </div>
      <ModeToggle />
    </>
  );
}
