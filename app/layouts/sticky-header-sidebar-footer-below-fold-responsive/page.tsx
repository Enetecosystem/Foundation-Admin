import { FakeParagraphs } from "@/components/helpers/FakeParagraphs";
import { FakeWordList } from "@/components/helpers/FakeWordList";
import { StickyFooter } from "@/components/layout/sticky-footer";
import { Paragraph } from "@/components/layout/paragraph";
import { ResponsiveSidebarButton } from "@/components/layout/responsive-sidebar-button";
import { StickyHeader } from "@/components/layout/sticky-header";
import { StickySidebar } from "@/components/layout/sticky-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

// You control the responsive page layout breakpoint, in this example
// we use `sm:` (640px).
export default function Layout() {
  const sidebar = (
    <>
      <div>Sticky sidebar</div>
      <FakeWordList count={80} length={[4, 15]} capitalize />
      Last
    </>
  );
  return (
    <>
      <StickyHeader className="flex h-[3.25rem] items-center justify-between p-2">
        Sticky header
        <ResponsiveSidebarButton className="sm:hidden">
          <div className="bg-background fixed top-[calc(3.25rem+1px)] h-[calc(100vh-(3.25rem+1px))] w-screen sm:hidden">
            <ScrollArea className="h-full">{sidebar}</ScrollArea>
          </div>
        </ResponsiveSidebarButton>
      </StickyHeader>
      <div className="container grid-cols-[240px_minmax(0,1fr)] sm:grid">
        <StickySidebar className="top-[calc(3.25rem+1px)] hidden h-[calc(100vh-(3.25rem+1px))] sm:block">
          {sidebar}
        </StickySidebar>
        <main className="min-h-[calc(100vh-(3.25rem+1px))]">
          <Paragraph>Main content</Paragraph>
          <FakeParagraphs words={80} count={15} />
        </main>
      </div>
      <StickyFooter>
        Footer below fold | Should contain some metadata
      </StickyFooter>
    </>
  );
}
