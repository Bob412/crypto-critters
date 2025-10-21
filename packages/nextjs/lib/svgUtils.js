/**
 * SVG utility functions for the CryptoCritters application
 */

/**
 * Parse SVG image data from a data URI
 * @param {string} dataUri - The data URI containing the SVG image
 * @returns {string} - The SVG image content
 */
export function parseSvgFromDataURI(dataUri) {
  if (!dataUri) return null;

  // Extract the base64 data from the data URI
  const base64Data = dataUri.replace("data:image/svg+xml;base64,", "");

  try {
    // Decode the base64 data to get the SVG content
    const svgString = Buffer.from(base64Data, "base64").toString();
    return svgString;
  } catch (error) {
    console.error("Error parsing SVG from data URI:", error);
    return null;
  }
}

/**
 * Extract properties from the SVG to determine what the critter looks like
 * @param {string} svgString - The SVG content as a string
 * @returns {object} - Object containing extracted properties
 */
export function extractSvgProperties(svgString) {
  if (!svgString) return {};

  const properties = {
    color: extractProperty(svgString, 'fill="', '"', /fill="([^"]+)"/),
    shape: determineSvgShape(svgString),
    pattern: svgString.includes('<pattern id="')
      ? svgString.includes('<pattern id="stripes"')
        ? "striped"
        : "dotted"
      : "solid",
    background: extractProperty(
      svgString,
      'rect width="100%" height="100%" fill="',
      '"',
      /fill="([^"]+)"/,
    ),
  };

  return properties;
}

/**
 * Determine the shape of the SVG
 * @param {string} svgString - The SVG content as a string
 * @returns {string} - The shape name ('circle', 'square', or 'triangle')
 */
function determineSvgShape(svgString) {
  if (svgString.includes("<circle ")) return "circle";
  if (
    svgString.includes("<rect ") &&
    !svgString.includes('width="100%" height="100%"')
  )
    return "square";
  if (svgString.includes("<polygon ")) return "triangle";
  return "unknown";
}

/**
 * Extract a property from the SVG string
 * @param {string} svgString - The SVG content as a string
 * @param {string} prefix - The prefix before the value
 * @param {string} suffix - The suffix after the value
 * @param {RegExp} regex - Regular expression to match the property
 * @returns {string|null} - The extracted property or null if not found
 */
function extractProperty(svgString, prefix, suffix, regex) {
  // Try regex first for more robust extraction
  const regexMatch = svgString.match(regex);
  if (regexMatch && regexMatch[1]) {
    return regexMatch[1];
  }

  // Fallback to string-based extraction
  const startIndex = svgString.indexOf(prefix);
  if (startIndex === -1) return null;

  const valueStart = startIndex + prefix.length;
  const valueEnd = svgString.indexOf(suffix, valueStart);
  if (valueEnd === -1) return null;

  return svgString.substring(valueStart, valueEnd);
}

/**
 * Create a preview component based on metadata properties
 * @param {object} properties - Object containing the visual properties
 * @returns {object} - CSS styles object for the preview component
 */
export function createPreviewStyles(properties) {
  if (!properties) return {};

  const { color, shape, pattern, background } = properties;

  const styles = {
    container: {
      backgroundColor: background || "lightgray",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "8px",
      overflow: "hidden",
    },
  };

  // Base shape styles
  const shapeStyles = {
    width: "70%",
    height: "70%",
  };

  // Shape-specific styles
  switch (shape) {
    case "circle":
      shapeStyles.borderRadius = "50%";
      break;
    case "square":
      shapeStyles.borderRadius = "0";
      break;
    case "triangle":
      // Triangle is handled differently via border manipulation
      shapeStyles.width = "0";
      shapeStyles.height = "0";
      shapeStyles.borderLeft = "35px solid transparent";
      shapeStyles.borderRight = "35px solid transparent";
      shapeStyles.borderBottom = `70px solid ${color || "gray"}`;
      return { container: styles.container, shape: shapeStyles };
  }

  // Pattern styles
  if (pattern === "striped") {
    shapeStyles.background = `repeating-linear-gradient(
      45deg,
      ${color || "gray"},
      ${color || "gray"} 10px,
      rgba(255,255,255,0.5) 10px,
      rgba(255,255,255,0.5) 20px
    )`;
  } else if (pattern === "dotted") {
    shapeStyles.background = `radial-gradient(
      circle,
      ${color || "gray"} 25%,
      transparent 26%
    ) 0 0 / 20px 20px`;
    shapeStyles.backgroundColor = color || "gray";
    shapeStyles.opacity = 0.7;
  } else {
    shapeStyles.backgroundColor = color || "gray";
  }

  return {
    container: styles.container,
    shape: shapeStyles,
  };
}
