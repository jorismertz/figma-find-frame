type Frame = { name: string; data: string };

// Extracts only the required fields to improve search performance
function getAllFrames(): Frame[] {
  return figma.root
    .findAllWithCriteria({
      types: ["FRAME"],
    })
    .map((frame) => {
      return {
        name: frame.name,
        data: frame.id,
      };
    });
}

function filterFramesByName(frames: Frame[], query: string): Frame[] {
  return frames.filter((frame) =>
    frame.name.toLowerCase().includes(query.toLowerCase())
  );
}

// Loading all frames on plugin start to prevent re-loading on every input
// This improves search performance significantly
const frames: Frame[] = getAllFrames();

figma.parameters.on("input", ({ query, result }: ParameterInputEvent) => {
  const filteredFrames = filterFramesByName(frames, query);
  result.setSuggestions(filteredFrames);
});

figma.on("run", ({ parameters }: RunEvent) => {
  const frame = figma.getNodeById(parameters?.frame);
  if (!parameters || !frame) return figma.closePlugin();

  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.closePlugin();
});
