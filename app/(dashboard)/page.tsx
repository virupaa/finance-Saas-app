"use client";

import { useGetAccounts  } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Button } from "@/components/ui/button";
import { DataGrid } from "@/components/data-grid";
import { DataCharts } from "@/components/data-charts";
export default function DashboardPage() {
   
  // const { data: accounts, isLoading} = useGetAccounts();

  // if(isLoading){
  //   return(
  //     <div>
  //       Loading...
  //     </div>
  //   )
  // }
  // return (
  //  <div>
  //   {accounts?.map((account) => (
  //     <div key={account.id}>
  //       {account.name}
  //     </div>
  //   ))}
  //  </div>
  // );

  return(
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      <DataCharts />
    </div>
  )
}
