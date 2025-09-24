import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogTitle } from "@radix-ui/react-dialog";
import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";
import IncreaseContent from "./increaseContent";
import ExtendContent from "./extendContent";
import TransferContent from "./transferContent";
import MergeContent from "./mergeContent";
import WithdrawContent from "./withdrawContent";
import ManageLockDropdown from "./manageLockDropdown";
import { LockPosition } from "@/gql/graphql";
import useLockQueries from "@/lib/hooks/envio/useLockQueries";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLockPosition?: LockPosition;
  reset?: () => void;
  onDropdownChange: (position?: LockPosition) => void;
}

export default function ManageLockDialog({
  open,
  setOpen,
  selectedLockPosition,
  reset,
  onDropdownChange,
}: Props) {
  const { useQLGetAccountLockPositions } = useLockQueries();
  const { data: QLLockPositions, refetch } = useQLGetAccountLockPositions(
    1000,
    60_000
  );
  return (
    <div className="px-2 justify-center flex items-center w-full">
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen && reset) reset();
        }}
      >
        <DialogContent position="static" className="lg:max-w-[520px]">
          <DialogTitle className="text-lg">
            Manage your <span className="text-primary-400">lock</span>
          </DialogTitle>

          {!!selectedLockPosition && (
            <Tabs className="overflow-auto w-full">
              <TabsList
                className="w-full overflow-auto px-1"
                display={"grow"}
                colors={"transparent"}
              >
                <TabsTrigger
                  border="primary-1"
                  display="grow"
                  value="increase"
                  colors="white"
                >
                  Increase
                </TabsTrigger>
                <TabsTrigger
                  border="primary-1"
                  display="grow"
                  value="extend"
                  colors="white"
                >
                  Extend
                </TabsTrigger>
                <TabsTrigger
                  border="primary-1"
                  display="grow"
                  value="transfer"
                  colors="white"
                >
                  Transfer
                </TabsTrigger>
                <TabsTrigger
                  border="primary-1"
                  display="grow"
                  value="withdraw"
                  colors="white"
                >
                  Withdraw
                </TabsTrigger>
                <TabsTrigger
                  border="primary-1"
                  display="grow"
                  value="merge"
                  colors="white"
                >
                  Merge
                </TabsTrigger>
              </TabsList>
              <div className="py-4">
                <ManageLockDropdown
                  lockPositions={
                    QLLockPositions?.LockPosition as LockPosition[]
                  }
                  selectedLockPosition={selectedLockPosition}
                  onPositionSelected={onDropdownChange}
                />
              </div>
              <TabsContent value="increase">
                <IncreaseContent
                  lockPosition={selectedLockPosition}
                  onTransactionComplete={refetch}
                />
              </TabsContent>
              <TabsContent value="extend">
                <ExtendContent
                  lockPosition={selectedLockPosition}
                  onTransactionComplete={refetch}
                />
              </TabsContent>
              <TabsContent value="transfer">
                <TransferContent
                  lockPosition={selectedLockPosition}
                  onTransactionComplete={refetch}
                />
              </TabsContent>
              <TabsContent value="merge">
                <MergeContent
                  lockPosition={selectedLockPosition}
                  onTransactionComplete={refetch}
                />
              </TabsContent>
              <TabsContent value="withdraw">
                <WithdrawContent
                  lockPosition={selectedLockPosition}
                  onTransactionComplete={refetch}
                />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
