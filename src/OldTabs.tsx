export const X = () => null;
// {
//   /* <HStack w="100%" p="8px 16px">
//         {mapN(STEPS, (i) => (
//           <Box
//             key={`step-indicator-${i}`}
//             h="8px"
//             w={`${100 / STEPS}%`}
//             bg={i === currentStep ? "blue" : "white"}
//           ></Box>
//         ))}
//       </HStack> */
// }

// <HStack w="100%" p="16px" pb={0}>
//   <Box onClick={() => setTab("drums")} p="5px" w="33.3%" bg="blue">
//     drums
//   </Box>
//   <Box onClick={() => setTab("synth")} p="5px" w="33.3%" bg="hotpink">
//     synth 1
//   </Box>
//   <Box onClick={() => setTab("synth")} p="5px" w="33.3%" bg="turquoise">
//     synth 2
//   </Box>
// </HStack>;

// {
//   tab === "drums" && (
//     <StepSeq
//       currentStep={currentStep}
//       state={drumStepState}
//       toggleStep={toggleDrumStep}
//     />
//   );
// }

// {
//   tab === "synth" && (
//     <SliderSeq
//       counter={currentStep}
//       toggleStepActive={(i) =>
//         setSynthStepState((s) => {
//           const next = [...s];
//           next[i].active = !next[i].active;
//           return next;
//         })
//       }
//       onStepChange={(i, value) =>
//         setSynthStepState((s) => {
//           const next = [...s];
//           next[i].value = value;
//           next[i].active = true;
//           return next;
//         })
//       }
//       state={synthStepState}
//     />
//   );
// }
