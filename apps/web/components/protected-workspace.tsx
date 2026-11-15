"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Workspace from "./workspace";

export default function ProtectedWorkspace({module}:{module:"dashboard"|"sales"|"inventory"|"products"|"purchases"|"customers"|"suppliers"|"expenses"|"reports"|"settings"}){
 const router=useRouter();const [ready,setReady]=useState(false);
 useEffect(()=>{let active=true;(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace("/login");return;}const {data,error}=await supabase.from("business_members").select("id").eq("user_id",user.id).eq("status","active").limit(1);if(!active)return;if(error){router.replace("/onboarding");return;}if(!data?.length){router.replace("/onboarding");return;}setReady(true);})();return()=>{active=false;};},[router]);
 if(!ready)return <div className="grid min-h-screen place-items-center bg-slate-50"><p className="text-sm font-semibold text-slate-500">Loading your secure workspace…</p></div>;
 return <Workspace module={module}/>;
}