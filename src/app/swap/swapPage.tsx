import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import SwapView from "./__components__/swapView";
import PageMarginContainer from "@/components/ui/pageMarginContainer";
import SettingsDialog from "./__components__/settingsDialog";

export default function SwapPage() {
  return (
    <PageMarginContainer>
      <div className="mx-auto w-[440px]">
        <div className="py-4">
          <div className="py-2 flex items-end justify-between">
            <h1 className="text-primary-400 text-[44px] leading-[44px]">
              Trade
            </h1>
            <div>
              <SettingsDialog />
            </div>
          </div>
          <div className="pt-2 hidden">
            <Tabs defaultValue="swap">
              <TabsList size="md" colors="muted" display={"grow"}>
                <TabsTrigger display={"grow"} value="swap">
                  Swap
                </TabsTrigger>
                <TabsTrigger display={"grow"} value="twap">
                  TWAP
                </TabsTrigger>
                <TabsTrigger display={"grow"} value="limit">
                  Limit
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <Card className="min-w-[380px] p-0 rounded-md">
          {/* <SwapView /> */}
          <SwapView />
        </Card>
      </div>
    </PageMarginContainer>
  );
}
