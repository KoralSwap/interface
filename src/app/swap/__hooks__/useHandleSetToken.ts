// import { useCallback } from "react";
// import { TToken } from "@/lib/types";

// export default function useHandleSetToken() {
//   const { updateState, state } = useSwapProvider();
//
//   const bothSelected = state.inToken && state.outToken;
//   return useCallback(
//     (token: TToken) => {
//       if (state.inTokenModalOpen) {
//         // inputOneModalOpen
//         if (bothSelected) {
//           updateState({
//             inToken: token,
//             outToken: undefined,
//             inTokenModalOpen: false,
//           });
//         } else {
//           updateState({ inToken: token, inTokenModalOpen: false });
//         }
//       }
//       //inputTwoModalOpen
//       if (state.outTokenModalOpen) {
//         if (bothSelected) {
//           updateState({
//             inToken: undefined,
//             outToken: token,
//             outTokenModalOpen: false,
//           });
//         } else {
//           updateState({
//             outToken: token,
//             outTokenModalOpen: false,
//           });
//         }
//       }
//     },
//     [bothSelected, state, updateState]
//   );
// }
