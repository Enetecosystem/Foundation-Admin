import MainLayout from "@/components/layout/main";



// TODO: handle updates for the default settings of the mobile app
// TODO: 1 --> Handle default mine rate, mine hours, xp count,
// TODO: 2 --> Render each seciton in card component with input
// TODO: 3 --> Update the convex db with the user's new configurations



function ConfigPage() {

  return (
    <MainLayout>
      <div className="mt-5 flex w-full flex-col gap-8">
        <div className="h-full w-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">App Configuration</h2>
              <p className="text-muted-foreground">
                Configure the Enet miner mobile applications defaults(mine rate, xp count, referral points, e.t.c)
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );

}

export default ConfigPage;
