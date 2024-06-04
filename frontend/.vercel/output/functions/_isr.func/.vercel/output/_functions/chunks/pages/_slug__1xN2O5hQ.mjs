/* empty css                           */
import { A as AstroError, e as InvalidImageService, f as ExpectedImageOptions, E as ExpectedImage, F as FailedToFetchRemoteImageDimensions, c as createAstro, d as createComponent, g as ImageMissingAlt, r as renderTemplate, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, i as renderSlot, j as renderComponent, k as Fragment, u as unescapeHTML, l as renderHead } from '../astro_kNrZ8Xzf.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                           */
import { twMerge } from 'tailwind-merge';
/* empty css                           */
import qs from 'qs';
import { i as isRemoteImage, a as isESMImportedImage, b as isLocalService, D as DEFAULT_HASH_PROPS } from '../astro/assets-service_CM0HYzGU.mjs';

const decoder = new TextDecoder();
const toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
const toHexString = (input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i) => memo + ("0" + i.toString(16)).slice(-2), "");
const readInt16LE = (input, offset = 0) => {
  const val = input[offset] + input[offset + 1] * 2 ** 8;
  return val | (val & 2 ** 15) * 131070;
};
const readUInt16BE = (input, offset = 0) => input[offset] * 2 ** 8 + input[offset + 1];
const readUInt16LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8;
const readUInt24LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16;
const readInt32LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + (input[offset + 3] << 24);
const readUInt32BE = (input, offset = 0) => input[offset] * 2 ** 24 + input[offset + 1] * 2 ** 16 + input[offset + 2] * 2 ** 8 + input[offset + 3];
const readUInt32LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + input[offset + 3] * 2 ** 24;
const methods = {
  readUInt16BE,
  readUInt16LE,
  readUInt32BE,
  readUInt32LE
};
function readUInt(input, bits, offset, isBigEndian) {
  offset = offset || 0;
  const endian = isBigEndian ? "BE" : "LE";
  const methodName = "readUInt" + bits + endian;
  return methods[methodName](input, offset);
}
function readBox(buffer, offset) {
  if (buffer.length - offset < 4)
    return;
  const boxSize = readUInt32BE(buffer, offset);
  if (buffer.length - offset < boxSize)
    return;
  return {
    name: toUTF8String(buffer, 4 + offset, 8 + offset),
    offset,
    size: boxSize
  };
}
function findBox(buffer, boxName, offset) {
  while (offset < buffer.length) {
    const box = readBox(buffer, offset);
    if (!box)
      break;
    if (box.name === boxName)
      return box;
    offset += box.size;
  }
}

const BMP = {
  validate: (input) => toUTF8String(input, 0, 2) === "BM",
  calculate: (input) => ({
    height: Math.abs(readInt32LE(input, 22)),
    width: readUInt32LE(input, 18)
  })
};

const TYPE_ICON = 1;
const SIZE_HEADER$1 = 2 + 2 + 2;
const SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize$1(input, imageIndex) {
  const offset = SIZE_HEADER$1 + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
const ICO = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0)
      return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_ICON;
  },
  calculate(input) {
    const nbImages = readUInt16LE(input, 4);
    const imageSize = getImageSize$1(input, 0);
    if (nbImages === 1)
      return imageSize;
    const imgs = [imageSize];
    for (let imageIndex = 1; imageIndex < nbImages; imageIndex += 1) {
      imgs.push(getImageSize$1(input, imageIndex));
    }
    return {
      height: imageSize.height,
      images: imgs,
      width: imageSize.width
    };
  }
};

const TYPE_CURSOR = 2;
const CUR = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0)
      return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_CURSOR;
  },
  calculate: (input) => ICO.calculate(input)
};

const DDS = {
  validate: (input) => readUInt32LE(input, 0) === 542327876,
  calculate: (input) => ({
    height: readUInt32LE(input, 12),
    width: readUInt32LE(input, 16)
  })
};

const gifRegexp = /^GIF8[79]a/;
const GIF = {
  validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
  calculate: (input) => ({
    height: readUInt16LE(input, 8),
    width: readUInt16LE(input, 6)
  })
};

const brandMap = {
  avif: "avif",
  mif1: "heif",
  msf1: "heif",
  // hief-sequence
  heic: "heic",
  heix: "heic",
  hevc: "heic",
  // heic-sequence
  hevx: "heic"
  // heic-sequence
};
function detectBrands(buffer, start, end) {
  let brandsDetected = {};
  for (let i = start; i <= end; i += 4) {
    const brand = toUTF8String(buffer, i, i + 4);
    if (brand in brandMap) {
      brandsDetected[brand] = 1;
    }
  }
  if ("avif" in brandsDetected) {
    return "avif";
  } else if ("heic" in brandsDetected || "heix" in brandsDetected || "hevc" in brandsDetected || "hevx" in brandsDetected) {
    return "heic";
  } else if ("mif1" in brandsDetected || "msf1" in brandsDetected) {
    return "heif";
  }
}
const HEIF = {
  validate(buffer) {
    const ftype = toUTF8String(buffer, 4, 8);
    const brand = toUTF8String(buffer, 8, 12);
    return "ftyp" === ftype && brand in brandMap;
  },
  calculate(buffer) {
    const metaBox = findBox(buffer, "meta", 0);
    const iprpBox = metaBox && findBox(buffer, "iprp", metaBox.offset + 12);
    const ipcoBox = iprpBox && findBox(buffer, "ipco", iprpBox.offset + 8);
    const ispeBox = ipcoBox && findBox(buffer, "ispe", ipcoBox.offset + 8);
    if (ispeBox) {
      return {
        height: readUInt32BE(buffer, ispeBox.offset + 16),
        width: readUInt32BE(buffer, ispeBox.offset + 12),
        type: detectBrands(buffer, 8, metaBox.offset)
      };
    }
    throw new TypeError("Invalid HEIF, no size found");
  }
};

const SIZE_HEADER = 4 + 4;
const FILE_LENGTH_OFFSET = 4;
const ENTRY_LENGTH_OFFSET = 4;
const ICON_TYPE_SIZE = {
  ICON: 32,
  "ICN#": 32,
  // m => 16 x 16
  "icm#": 16,
  icm4: 16,
  icm8: 16,
  // s => 16 x 16
  "ics#": 16,
  ics4: 16,
  ics8: 16,
  is32: 16,
  s8mk: 16,
  icp4: 16,
  // l => 32 x 32
  icl4: 32,
  icl8: 32,
  il32: 32,
  l8mk: 32,
  icp5: 32,
  ic11: 32,
  // h => 48 x 48
  ich4: 48,
  ich8: 48,
  ih32: 48,
  h8mk: 48,
  // . => 64 x 64
  icp6: 64,
  ic12: 32,
  // t => 128 x 128
  it32: 128,
  t8mk: 128,
  ic07: 128,
  // . => 256 x 256
  ic08: 256,
  ic13: 256,
  // . => 512 x 512
  ic09: 512,
  ic14: 512,
  // . => 1024 x 1024
  ic10: 1024
};
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  return [
    toUTF8String(input, imageOffset, imageLengthOffset),
    readUInt32BE(input, imageLengthOffset)
  ];
}
function getImageSize(type) {
  const size = ICON_TYPE_SIZE[type];
  return { width: size, height: size, type };
}
const ICNS = {
  validate: (input) => toUTF8String(input, 0, 4) === "icns",
  calculate(input) {
    const inputLength = input.length;
    const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
    let imageOffset = SIZE_HEADER;
    let imageHeader = readImageHeader(input, imageOffset);
    let imageSize = getImageSize(imageHeader[0]);
    imageOffset += imageHeader[1];
    if (imageOffset === fileLength)
      return imageSize;
    const result = {
      height: imageSize.height,
      images: [imageSize],
      width: imageSize.width
    };
    while (imageOffset < fileLength && imageOffset < inputLength) {
      imageHeader = readImageHeader(input, imageOffset);
      imageSize = getImageSize(imageHeader[0]);
      imageOffset += imageHeader[1];
      result.images.push(imageSize);
    }
    return result;
  }
};

const J2C = {
  // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
  validate: (input) => toHexString(input, 0, 4) === "ff4fff51",
  calculate: (input) => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8)
  })
};

const JP2 = {
  validate(input) {
    if (readUInt32BE(input, 4) !== 1783636e3 || readUInt32BE(input, 0) < 1)
      return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox)
      return false;
    return readUInt32BE(input, ftypBox.offset + 4) === 1718909296;
  },
  calculate(input) {
    const jp2hBox = findBox(input, "jp2h", 0);
    const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
    if (ihdrBox) {
      return {
        height: readUInt32BE(input, ihdrBox.offset + 8),
        width: readUInt32BE(input, ihdrBox.offset + 12)
      };
    }
    throw new TypeError("Unsupported JPEG 2000 format");
  }
};

const EXIF_MARKER = "45786966";
const APP1_DATA_SIZE_BYTES = 2;
const EXIF_HEADER_BYTES = 6;
const TIFF_BYTE_ALIGN_BYTES = 2;
const BIG_ENDIAN_BYTE_ALIGN = "4d4d";
const LITTLE_ENDIAN_BYTE_ALIGN = "4949";
const IDF_ENTRY_BYTES = 12;
const NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfOffset = 8;
  const offset = EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;
    if (start > exifBlock.length) {
      return;
    }
    const block = exifBlock.slice(start, end);
    const tagNumber = readUInt(block, 16, 0, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt(block, 16, 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt(block, 32, 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt(block, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(
    exifBlock,
    EXIF_HEADER_BYTES,
    EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES
  );
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(exifBlock, isBigEndian);
  }
}
function validateInput(input, index) {
  if (index > input.length) {
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
}
const JPG = {
  validate: (input) => toHexString(input, 0, 2) === "ffd8",
  calculate(input) {
    input = input.slice(4);
    let orientation;
    let next;
    while (input.length) {
      const i = readUInt16BE(input, 0);
      if (input[i] !== 255) {
        input = input.slice(1);
        continue;
      }
      if (isEXIF(input)) {
        orientation = validateExifBlock(input, i);
      }
      validateInput(input, i);
      next = input[i + 1];
      if (next === 192 || next === 193 || next === 194) {
        const size = extractSize(input, i + 5);
        if (!orientation) {
          return size;
        }
        return {
          height: size.height,
          orientation,
          width: size.width
        };
      }
      input = input.slice(i + 2);
    }
    throw new TypeError("Invalid JPG, no size found");
  }
};

const KTX = {
  validate: (input) => {
    const signature = toUTF8String(input, 1, 7);
    return ["KTX 11", "KTX 20"].includes(signature);
  },
  calculate: (input) => {
    const type = input[5] === 49 ? "ktx" : "ktx2";
    const offset = type === "ktx" ? 36 : 20;
    return {
      height: readUInt32LE(input, offset + 4),
      width: readUInt32LE(input, offset),
      type
    };
  }
};

const pngSignature = "PNG\r\n\n";
const pngImageHeaderChunkName = "IHDR";
const pngFriedChunkName = "CgBI";
const PNG = {
  validate(input) {
    if (pngSignature === toUTF8String(input, 1, 8)) {
      let chunkName = toUTF8String(input, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toUTF8String(input, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError("Invalid PNG");
      }
      return true;
    }
    return false;
  },
  calculate(input) {
    if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(input, 36),
        width: readUInt32BE(input, 32)
      };
    }
    return {
      height: readUInt32BE(input, 20),
      width: readUInt32BE(input, 16)
    };
  }
};

const PNMTypes = {
  P1: "pbm/ascii",
  P2: "pgm/ascii",
  P3: "ppm/ascii",
  P4: "pbm",
  P5: "pgm",
  P6: "ppm",
  P7: "pam",
  PF: "pfm"
};
const handlers = {
  default: (lines) => {
    let dimensions = [];
    while (lines.length > 0) {
      const line = lines.shift();
      if (line[0] === "#") {
        continue;
      }
      dimensions = line.split(" ");
      break;
    }
    if (dimensions.length === 2) {
      return {
        height: parseInt(dimensions[1], 10),
        width: parseInt(dimensions[0], 10)
      };
    } else {
      throw new TypeError("Invalid PNM");
    }
  },
  pam: (lines) => {
    const size = {};
    while (lines.length > 0) {
      const line = lines.shift();
      if (line.length > 16 || line.charCodeAt(0) > 128) {
        continue;
      }
      const [key, value] = line.split(" ");
      if (key && value) {
        size[key.toLowerCase()] = parseInt(value, 10);
      }
      if (size.height && size.width) {
        break;
      }
    }
    if (size.height && size.width) {
      return {
        height: size.height,
        width: size.width
      };
    } else {
      throw new TypeError("Invalid PAM");
    }
  }
};
const PNM = {
  validate: (input) => toUTF8String(input, 0, 2) in PNMTypes,
  calculate(input) {
    const signature = toUTF8String(input, 0, 2);
    const type = PNMTypes[signature];
    const lines = toUTF8String(input, 3).split(/[\r\n]+/);
    const handler = handlers[type] || handlers.default;
    return handler(lines);
  }
};

const PSD = {
  validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
  calculate: (input) => ({
    height: readUInt32BE(input, 14),
    width: readUInt32BE(input, 18)
  })
};

const svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
const extractorRegExps = {
  height: /\sheight=(['"])([^%]+?)\1/,
  root: svgReg,
  viewbox: /\sviewBox=(['"])(.+?)\1/i,
  width: /\swidth=(['"])([^%]+?)\1/
};
const INCH_CM = 2.54;
const units = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: 96 / INCH_CM * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1
};
const unitsReg = new RegExp(
  // eslint-disable-next-line regexp/prefer-d
  `^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`
);
function parseLength(len) {
  const m = unitsReg.exec(len);
  if (!m) {
    return void 0;
  }
  return Math.round(Number(m[1]) * (units[m[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root) {
  const width = root.match(extractorRegExps.width);
  const height = root.match(extractorRegExps.height);
  const viewbox = root.match(extractorRegExps.viewbox);
  return {
    height: height && parseLength(height[2]),
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width
    };
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
const SVG = {
  // Scan only the first kilo-byte to speed up the check on larger files
  validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
  calculate(input) {
    const root = toUTF8String(input).match(extractorRegExps.root);
    if (root) {
      const attrs = parseAttributes(root[0]);
      if (attrs.width && attrs.height) {
        return calculateByDimensions(attrs);
      }
      if (attrs.viewbox) {
        return calculateByViewbox(attrs, attrs.viewbox);
      }
    }
    throw new TypeError("Invalid SVG");
  }
};

const TGA = {
  validate(input) {
    return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
  },
  calculate(input) {
    return {
      height: readUInt16LE(input, 14),
      width: readUInt16LE(input, 12)
    };
  }
};

function readIFD(input, isBigEndian) {
  const ifdOffset = readUInt(input, 32, 4, isBigEndian);
  return input.slice(ifdOffset + 2);
}
function readValue(input, isBigEndian) {
  const low = readUInt(input, 16, 8, isBigEndian);
  const high = readUInt(input, 16, 10, isBigEndian);
  return (high << 16) + low;
}
function nextTag(input) {
  if (input.length > 24) {
    return input.slice(12);
  }
}
function extractTags(input, isBigEndian) {
  const tags = {};
  let temp = input;
  while (temp && temp.length) {
    const code = readUInt(temp, 16, 0, isBigEndian);
    const type = readUInt(temp, 16, 2, isBigEndian);
    const length = readUInt(temp, 32, 4, isBigEndian);
    if (code === 0) {
      break;
    } else {
      if (length === 1 && (type === 3 || type === 4)) {
        tags[code] = readValue(temp, isBigEndian);
      }
      temp = nextTag(temp);
    }
  }
  return tags;
}
function determineEndianness(input) {
  const signature = toUTF8String(input, 0, 2);
  if ("II" === signature) {
    return "LE";
  } else if ("MM" === signature) {
    return "BE";
  }
}
const signatures = [
  // '492049', // currently not supported
  "49492a00",
  // Little endian
  "4d4d002a"
  // Big Endian
  // '4d4d002a', // BigTIFF > 4GB. currently not supported
];
const TIFF = {
  validate: (input) => signatures.includes(toHexString(input, 0, 4)),
  calculate(input) {
    const isBigEndian = determineEndianness(input) === "BE";
    const ifdBuffer = readIFD(input, isBigEndian);
    const tags = extractTags(ifdBuffer, isBigEndian);
    const width = tags[256];
    const height = tags[257];
    if (!width || !height) {
      throw new TypeError("Invalid Tiff. Missing tags");
    }
    return { height, width };
  }
};

function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
const WEBP = {
  validate(input) {
    const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
    const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
    const vp8Header = "VP8" === toUTF8String(input, 12, 15);
    return riffHeader && webpHeader && vp8Header;
  },
  calculate(input) {
    const chunkHeader = toUTF8String(input, 12, 16);
    input = input.slice(20, 30);
    if (chunkHeader === "VP8X") {
      const extendedHeader = input[0];
      const validStart = (extendedHeader & 192) === 0;
      const validEnd = (extendedHeader & 1) === 0;
      if (validStart && validEnd) {
        return calculateExtended(input);
      } else {
        throw new TypeError("Invalid WebP");
      }
    }
    if (chunkHeader === "VP8 " && input[0] !== 47) {
      return calculateLossy(input);
    }
    const signature = toHexString(input, 3, 6);
    if (chunkHeader === "VP8L" && signature !== "9d012a") {
      return calculateLossless(input);
    }
    throw new TypeError("Invalid WebP");
  }
};

const typeHandlers = /* @__PURE__ */ new Map([
  ["bmp", BMP],
  ["cur", CUR],
  ["dds", DDS],
  ["gif", GIF],
  ["heif", HEIF],
  ["icns", ICNS],
  ["ico", ICO],
  ["j2c", J2C],
  ["jp2", JP2],
  ["jpg", JPG],
  ["ktx", KTX],
  ["png", PNG],
  ["pnm", PNM],
  ["psd", PSD],
  ["svg", SVG],
  ["tga", TGA],
  ["tiff", TIFF],
  ["webp", WEBP]
]);
const types = Array.from(typeHandlers.keys());

const firstBytes = /* @__PURE__ */ new Map([
  [56, "psd"],
  [66, "bmp"],
  [68, "dds"],
  [71, "gif"],
  [73, "tiff"],
  [77, "tiff"],
  [82, "webp"],
  [105, "icns"],
  [137, "png"],
  [255, "jpg"]
]);
function detector(input) {
  const byte = input[0];
  const type = firstBytes.get(byte);
  if (type && typeHandlers.get(type).validate(input)) {
    return type;
  }
  return types.find((fileType) => typeHandlers.get(fileType).validate(input));
}

const globalOptions = {
  disabledTypes: []
};
function lookup(input) {
  const type = detector(input);
  if (typeof type !== "undefined") {
    if (globalOptions.disabledTypes.indexOf(type) > -1) {
      throw new TypeError("disabled file type: " + type);
    }
    const size = typeHandlers.get(type).calculate(input);
    if (size !== void 0) {
      size.type = size.type ?? type;
      return size;
    }
  }
  throw new TypeError("unsupported file type: " + type);
}

async function probe(url) {
  const response = await fetch(url);
  if (!response.body || !response.ok) {
    throw new Error("Failed to fetch image");
  }
  const reader = response.body.getReader();
  let done, value;
  let accumulatedChunks = new Uint8Array();
  while (!done) {
    const readResult = await reader.read();
    done = readResult.done;
    if (done)
      break;
    if (readResult.value) {
      value = readResult.value;
      let tmp = new Uint8Array(accumulatedChunks.length + value.length);
      tmp.set(accumulatedChunks, 0);
      tmp.set(value, accumulatedChunks.length);
      accumulatedChunks = tmp;
      try {
        const dimensions = lookup(accumulatedChunks);
        if (dimensions) {
          await reader.cancel();
          return dimensions;
        }
      } catch (error) {
      }
    }
  }
  throw new Error("Failed to parse the size");
}

async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await import(
      // @ts-expect-error
      '../astro/assets-service_CM0HYzGU.mjs'
    ).then(n => n.g).catch((e) => {
      const error = new AstroError(InvalidImageService);
      error.cause = e;
      throw error;
    });
    if (!globalThis.astroAsset)
      globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig) {
  if (!options || typeof options !== "object") {
    throw new AstroError({
      ...ExpectedImageOptions,
      message: ExpectedImageOptions.message(JSON.stringify(options))
    });
  }
  if (typeof options.src === "undefined") {
    throw new AstroError({
      ...ExpectedImage,
      message: ExpectedImage.message(
        options.src,
        "undefined",
        JSON.stringify(options)
      )
    });
  }
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: typeof options.src === "object" && "then" in options.src ? (await options.src).default ?? await options.src : options.src
  };
  if (options.inferSize && isRemoteImage(resolvedOptions.src)) {
    try {
      const result = await probe(resolvedOptions.src);
      resolvedOptions.width ??= result.width;
      resolvedOptions.height ??= result.height;
      delete resolvedOptions.inferSize;
    } catch {
      throw new AstroError({
        ...FailedToFetchRemoteImageDimensions,
        message: FailedToFetchRemoteImageDimensions.message(resolvedOptions.src)
      });
    }
  }
  const originalPath = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.fsPath : resolvedOptions.src;
  const clonedSrc = isESMImportedImage(resolvedOptions.src) ? (
    // @ts-expect-error - clone is a private, hidden prop
    resolvedOptions.src.clone ?? resolvedOptions.src
  ) : resolvedOptions.src;
  resolvedOptions.src = clonedSrc;
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig) : resolvedOptions;
  const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig) : [];
  let imageURL = await service.getURL(validatedOptions, imageConfig);
  let srcSets = await Promise.all(
    srcSetTransforms.map(async (srcSet) => ({
      transform: srcSet.transform,
      url: await service.getURL(srcSet.transform, imageConfig),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }))
  );
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && imageURL === validatedOptions.src)) {
    const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
    imageURL = globalThis.astroAsset.addStaticImage(validatedOptions, propsToHash, originalPath);
    srcSets = srcSetTransforms.map((srcSet) => ({
      transform: srcSet.transform,
      url: globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash, originalPath),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }));
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    src: imageURL,
    srcSet: {
      values: srcSets,
      attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
    },
    attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig) : {}
  };
}

const $$Astro$K = createAstro("https://example.com");
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$K, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  if (typeof props.width === "string") {
    props.width = parseInt(props.width);
  }
  if (typeof props.height === "string") {
    props.height = parseInt(props.height);
  }
  const image = await getImage(props);
  const additionalAttributes = {};
  if (image.srcSet.values.length > 0) {
    additionalAttributes.srcset = image.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(additionalAttributes)}${spreadAttributes(image.attributes)}>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/node_modules/astro/components/Image.astro", void 0);

const $$Astro$J = createAstro("https://example.com");
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$J, $$props, $$slots);
  Astro2.self = $$Picture;
  const defaultFormats = ["webp"];
  const defaultFallbackFormat = "png";
  const specialFormatsFallback = ["gif", "svg", "jpg", "jpeg"];
  const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  const optimizedImages = await Promise.all(
    formats.map(
      async (format) => await getImage({ ...props, format, widths: props.widths, densities: props.densities })
    )
  );
  let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
  if (!fallbackFormat && isESMImportedImage(props.src) && specialFormatsFallback.includes(props.src.format)) {
    resultFallbackFormat = props.src.format;
  }
  const fallbackImage = await getImage({
    ...props,
    format: resultFallbackFormat,
    widths: props.widths,
    densities: props.densities
  });
  const imgAdditionalAttributes = {};
  const sourceAdditionalAttributes = {};
  if (props.sizes) {
    sourceAdditionalAttributes.sizes = props.sizes;
  }
  if (fallbackImage.srcSet.values.length > 0) {
    imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<picture${spreadAttributes(pictureAttributes)}> ${Object.entries(optimizedImages).map(([_, image]) => {
    const srcsetAttribute = props.densities || !props.densities && !props.widths ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
    return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute("image/" + image.options.format, "type")}${spreadAttributes(sourceAdditionalAttributes)}>`;
  })} <img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(imgAdditionalAttributes)}${spreadAttributes(fallbackImage.attributes)}> </picture>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/node_modules/astro/components/Picture.astro", void 0);

const imageConfig = {"service":{"entrypoint":"astro/assets/services/sharp","config":{}},"domains":[],"remotePatterns":[]};
					const outDir = new URL("file:///Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/.vercel/output/static/");
					new URL("_astro", outDir);
					const getImage = async (options) => await getImage$1(options, imageConfig);

const SITE_TITLE = "Astro Blog";
const SITE_DESCRIPTION = "Welcome to my website!";

const $$Astro$I = createAstro("https://example.com");
const $$BaseHead = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$I, $$props, $$slots);
  Astro2.self = $$BaseHead;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  const { title, description, image = "/blog-placeholder-1.jpg" } = Astro2.props;
  return renderTemplate`<!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- Canonical URL --><link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- Primary Meta Tags --><title>${title}</title><meta name="title"${addAttribute(title, "content")}><meta name="description"${addAttribute(description, "content")}><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(Astro2.url, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(new URL(image, Astro2.url), "content")}><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(Astro2.url, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(new URL(image, Astro2.url), "content")}>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/BaseHead.astro", void 0);

const $$Astro$H = createAstro("https://example.com");
const $$HeaderLink = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$H, $$props, $$slots);
  Astro2.self = $$HeaderLink;
  const { href, class: className, ...props } = Astro2.props;
  const { pathname } = Astro2.url;
  const subpath = pathname.match(/[^/]+/g);
  const isActive = href === pathname || href === "/" + subpath?.[0];
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(isActive, "data-is-active")}${addAttribute(href, "href")}${addAttribute(twMerge(
    "px-20 transition-all flex justify-center items-center gap-2 text-text-sub text-base font-normal leading-6 border-b data-[is-active]:border-b-primary-base data-[is-active]:text-text-main hover:text-text-main rounded-xxs",
    className
  ), "class")}${spreadAttributes(props)}> ${renderSlot($$result, $$slots["default"])} </a>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/HeaderLink.astro", void 0);

const $$Astro$G = createAstro("https://example.com");
const $$Screen = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$G, $$props, $$slots);
  Astro2.self = $$Screen;
  const { class: className, ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<main${addAttribute(twMerge(["w-full flex flex-col items-center gap-64 p-24 overflow-visible", className]), "class")}${spreadAttributes(props)}> ${renderSlot($$result, $$slots["default"])} </main>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/Screen.astro", void 0);

const $$Astro$F = createAstro("https://example.com");
const $$Container = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$F, $$props, $$slots);
  Astro2.self = $$Container;
  const { class: className, ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(twMerge(["container flex gap-24 lg:gap-32 items-start lg:py-80", className]), "class")}${spreadAttributes(props)}> ${renderSlot($$result, $$slots["default"])} </section>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/Container.astro", void 0);

const $$Astro$E = createAstro("https://example.com");
const $$ApiImage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$E, $$props, $$slots);
  Astro2.self = $$ApiImage;
  const { image, ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(`${process.env.NODE_ENV === "development" ? "http://localhost:1337" : ""}` + image.attributes.url, "src")}${addAttribute(image.attributes.width, "width")}${addAttribute(image.attributes.height, "height")}${addAttribute(image.attributes.alternativeText || "", "alt")}${spreadAttributes(rest)}>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/ApiImage.astro", void 0);

const $$Astro$D = createAstro("https://example.com");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$D, $$props, $$slots);
  Astro2.self = $$Header;
  const { brand } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<header class="Navbar w-full lg:px-28 bg-white border-b lg:border-b-0  border-gray-200 sticky top-0 justify-center items-center lg:items-stretch z-50"> ${renderComponent($$result, "Screen", $$Screen, { "class": "py-0 lg:py-0 h-[72px] lg:h-[96px] " }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, { "class": "py-0 lg:py-0 h-full items-center justify-between" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "ApiImage", $$ApiImage, { "image": brand, "class": "w-[139px] lg:w-[186px]" })} <nav class="Navigation hidden lg:flex justify-start items-stretch self-stretch"> ${renderComponent($$result3, "HeaderLink", $$HeaderLink, { "href": "/" }, { "default": ($$result4) => renderTemplate` Inicio ` })} ${renderComponent($$result3, "HeaderLink", $$HeaderLink, { "href": "/categoria" }, { "default": ($$result4) => renderTemplate` Categoria ` })} ${renderComponent($$result3, "HeaderLink", $$HeaderLink, { "href": "/categoria" }, { "default": ($$result4) => renderTemplate` Categoria ` })} ${renderComponent($$result3, "HeaderLink", $$HeaderLink, { "href": "/categoria" }, { "default": ($$result4) => renderTemplate` Categoria ` })} ${renderComponent($$result3, "HeaderLink", $$HeaderLink, { "href": "/categoria" }, { "default": ($$result4) => renderTemplate` Categoria ` })} </nav> <button class="lg:hidden"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path d="M5.49805 12.0002H18.5031" stroke="#596066" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5.49805 16.0022H18.5031" stroke="#596066" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5.49707 7.99826H18.5021" stroke="#596066" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </button> ` })} ` })} </header>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/Header.astro", void 0);

const $$Astro$C = createAstro("https://example.com");
const $$AuthorBox = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$C, $$props, $$slots);
  Astro2.self = $$AuthorBox;
  const { class: className, ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(twMerge(["h-48 flex justify-start items-center gap-12", className]), "class")}${spreadAttributes(rest)}> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/AuthorBox/AuthorBox.astro", void 0);

const $$Astro$B = createAstro("https://example.com");
const $$AuthorBoxArticleInfo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$B, $$props, $$slots);
  Astro2.self = $$AuthorBoxArticleInfo;
  return renderTemplate`${maybeRenderHead()}<div class="self-stretch text-[#9EA5AD] text-[12px] font-medium leading-[16px] break-words"> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/AuthorBox/AuthorBoxArticleInfo.astro", void 0);

const $$Astro$A = createAstro("https://example.com");
const $$AuthorBoxAvatar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$A, $$props, $$slots);
  Astro2.self = $$AuthorBoxAvatar;
  const { src, class: className, name, ...rest } = Astro2.props;
  const fallback = "https://via.placeholder.com/48x48";
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(twMerge(["w-[48px] h-[48px] relative rounded-full", className]), "class")}${addAttribute(src ? `${process.env.NODE_ENV === "development" ? "http://localhost:1337" : ""}` + src : fallback, "src")}${addAttribute(name, "alt")}${spreadAttributes(rest)}>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/AuthorBox/AuthorBoxAvatar.astro", void 0);

const $$Astro$z = createAstro("https://example.com");
const $$AuthorBoxBody = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$z, $$props, $$slots);
  Astro2.self = $$AuthorBoxBody;
  return renderTemplate`${maybeRenderHead()}<div class="Text flex-1 flex flex-col justify-start items-start gap-[4px]"> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/AuthorBox/AuthorBoxBody.astro", void 0);

const $$Astro$y = createAstro("https://example.com");
const $$AuthorBoxName = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$y, $$props, $$slots);
  Astro2.self = $$AuthorBoxName;
  const { class: className, ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<span${addAttribute(twMerge([
    "self-stretch text-[#24292E] text-[14px] font-medium leading-[20px] break-words",
    className
  ]), "class")}${spreadAttributes(rest)}> ${renderSlot($$result, $$slots["default"])} </span>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/AuthorBox/AuthorBoxName.astro", void 0);

const $$Astro$x = createAstro("https://example.com");
const $$FormattedDate = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$x, $$props, $$slots);
  Astro2.self = $$FormattedDate;
  const { date } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<time${addAttribute(date.toISOString(), "datetime")}> ${date.toLocaleDateString("pt-br", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })} </time>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/FormattedDate.astro", void 0);

const $$Astro$w = createAstro("https://example.com");
const $$AuthorComplement = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$w, $$props, $$slots);
  Astro2.self = $$AuthorComplement;
  const { author, date, readingTime } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="self-stretch items-start lg:items-center flex gap-8 lg:flex-row flex-col"> ${author ? renderTemplate`${renderComponent($$result, "AuthorBox", $$AuthorBox, { "class": "flex-1" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AuthorBoxAvatar", $$AuthorBoxAvatar, { "name": author.attributes.name, "src": author.attributes.avatar?.data.attributes.url })} ${renderComponent($$result2, "AuthorBoxBody", $$AuthorBoxBody, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "AuthorBoxName", $$AuthorBoxName, { "class": "text-white" }, { "default": ($$result4) => renderTemplate`${author.attributes.name}` })} ${renderComponent($$result3, "AuthorBoxArticleInfo", $$AuthorBoxArticleInfo, {}, { "default": ($$result4) => renderTemplate`${author.attributes.jobTitle}` })} ` })} ` })}` : renderTemplate`<div></div>`} <div class="flex gap-8 items-center"> <p class="font-normal text-base text-primary-lighter">${renderComponent($$result, "FormattedDate", $$FormattedDate, { "date": new Date(date) })}</p> <div class="size-4 shrink-0 rounded-full bg-primary-light"></div> <p class="font-semibold text-base text-primary-lighter">${readingTime} min de leitura</p> </div> </div>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/AuthorComplement/AuthorComplement.astro", void 0);

const $$Astro$v = createAstro("https://example.com");
const $$ProgressReading = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$v, $$props, $$slots);
  Astro2.self = $$ProgressReading;
  return renderTemplate`${maybeRenderHead()}<div id="progress-bar" class="bg-primary-800 sticky top-72 lg:top-96 left-0 h-8 self-start" data-astro-cid-j5hbaivd></div>  `;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/ProgressReading.astro", void 0);

const $$Astro$u = createAstro("https://example.com");
const $$ShareIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$u, $$props, $$slots);
  Astro2.self = $$ShareIcon;
  const { color = "#454C52", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"${addAttribute(color, "color")}${spreadAttributes(props)}> <path d="M6.74658 4.00003H10.2108C10.625 4.00003 10.9608 4.33582 10.9608 4.75003C10.9608 5.12972 10.6786 5.44352 10.3126 5.49318L10.2108 5.50003H6.74658C5.55572 5.50003 4.58094 6.42519 4.50177 7.59598L4.49658 7.75003V17.25C4.49658 18.4409 5.42174 19.4157 6.59253 19.4948L6.74658 19.5H16.2473C17.4382 19.5 18.413 18.5749 18.4921 17.4041L18.4973 17.25V16.7522C18.4973 16.338 18.8331 16.0022 19.2473 16.0022C19.627 16.0022 19.9408 16.2844 19.9905 16.6505L19.9973 16.7522V17.25C19.9973 19.2543 18.425 20.8913 16.4465 20.9948L16.2473 21H6.74658C4.74232 21 3.10531 19.4277 3.00178 17.4492L2.99658 17.25V7.75003C2.99658 5.74577 4.56894 4.10876 6.54742 4.00523L6.74658 4.00003H10.2108H6.74658ZM14.5006 6.51988V3.75003C14.5006 3.12606 15.2074 2.78998 15.6876 3.13983L15.7697 3.20877L21.7643 8.95877C22.0441 9.22712 22.0696 9.65814 21.8407 9.9561L21.7644 10.0412L15.7698 15.7931C15.3196 16.2251 14.5877 15.9477 14.5077 15.3589L14.5006 15.2519V12.5266L14.1571 12.5567C11.7574 12.807 9.45735 13.8879 7.24253 15.8174C6.72342 16.2696 5.92029 15.842 6.00567 15.1589C6.67046 9.83933 9.45233 6.90733 14.2012 6.53953L14.5006 6.51988V3.75003V6.51988ZM16.0006 5.50867V7.25003C16.0006 7.66424 15.6648 8.00003 15.2506 8.00003C11.3772 8.00003 8.97655 9.67616 7.93931 13.1572L7.86025 13.4358L8.21244 13.199C10.4489 11.7372 12.7983 11 15.2506 11C15.6303 11 15.9441 11.2822 15.9937 11.6483L16.0006 11.75V13.4928L20.1618 9.50012L16.0006 5.50867Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/ShareIcon.astro", void 0);

const $$Astro$t = createAstro("https://example.com");
const $$ShareFullIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$t, $$props, $$slots);
  Astro2.self = $$ShareFullIcon;
  const { color = "#10B981", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"${addAttribute(color, "color")}${spreadAttributes(props)}> <path d="M6.74658 4.00003H10.2108C10.625 4.00003 10.9608 4.33582 10.9608 4.75003C10.9608 5.12972 10.6786 5.44352 10.3126 5.49318L10.2108 5.50003H6.74658C5.55572 5.50003 4.58094 6.42519 4.50177 7.59598L4.49658 7.75003V17.25C4.49658 18.4409 5.42174 19.4157 6.59253 19.4948L6.74658 19.5H16.2473C17.4382 19.5 18.413 18.5749 18.4921 17.4041L18.4973 17.25V16.7522C18.4973 16.338 18.8331 16.0022 19.2473 16.0022C19.627 16.0022 19.9408 16.2844 19.9905 16.6505L19.9973 16.7522V17.25C19.9973 19.2543 18.425 20.8913 16.4465 20.9948L16.2473 21H6.74658C4.74232 21 3.10531 19.4277 3.00178 17.4492L2.99658 17.25V7.75003C2.99658 5.74577 4.56894 4.10876 6.54742 4.00523L6.74658 4.00003H10.2108H6.74658ZM14.5006 6.54434V3.75003C14.5006 3.12606 15.2074 2.78998 15.6876 3.13983L15.7697 3.20877L21.7643 8.95877C22.0441 9.22712 22.0696 9.65814 21.8407 9.9561L21.7644 10.0412L15.7698 15.7931C15.3196 16.2251 14.5877 15.9477 14.5077 15.3589L14.5006 15.2519V12.45L14.1798 12.4438C11.5223 12.4359 9.25072 13.5269 7.31495 15.745C6.81934 16.3129 5.88968 15.8769 6.0094 15.1328C6.83639 9.99236 9.60847 7.08831 14.1986 6.57446L14.5006 6.54434V3.75003V6.54434Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/ShareFullIcon.astro", void 0);

const $$Astro$s = createAstro("https://example.com");
const $$HearthFullIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$s, $$props, $$slots);
  Astro2.self = $$HearthFullIcon;
  const { color = "#DC2626", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"${addAttribute(color, "color")}${spreadAttributes(props)}> <path d="M12.8199 5.57961C12.3668 6.03372 11.6296 6.03248 11.1759 5.57886C9.07688 3.4798 5.67361 3.4798 3.57455 5.57886C1.47548 7.67793 1.47548 11.0812 3.57455 13.1803L11.4699 21.0756C11.7628 21.3685 12.2377 21.3685 12.5306 21.0756L20.432 13.1788C22.5264 11.0728 22.53 7.67906 20.4306 5.57961C18.3277 3.47672 14.9228 3.47672 12.8199 5.57961Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/HearthFullIcon.astro", void 0);

const $$Astro$r = createAstro("https://example.com");
const $$HearthIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$r, $$props, $$slots);
  Astro2.self = $$HearthIcon;
  const { color = "#454C52", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"${addAttribute(color, "color")}${spreadAttributes(props)}> <path d="M12.8199 5.57961L11.9992 6.40211L11.1759 5.57886C9.07688 3.4798 5.67361 3.4798 3.57455 5.57886C1.47548 7.67793 1.47548 11.0812 3.57455 13.1803L11.4699 21.0756C11.7628 21.3685 12.2377 21.3685 12.5306 21.0756L20.432 13.1788C22.5264 11.0728 22.53 7.67906 20.4306 5.57961C18.3277 3.47672 14.9228 3.47672 12.8199 5.57961ZM19.3684 12.1211L12.0002 19.4846L4.63521 12.1196C3.12192 10.6063 3.12192 8.15281 4.63521 6.63952C6.14849 5.12624 8.602 5.12624 10.1153 6.63952L11.4727 7.99697C11.7706 8.29483 12.2553 8.28903 12.5459 7.98412L13.8806 6.64027C15.3977 5.12317 17.8528 5.12316 19.3699 6.64027C20.8836 8.15391 20.881 10.6001 19.3684 12.1211Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/HearthIcon.astro", void 0);

const $$Astro$q = createAstro("https://example.com");
const $$MenuIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$q, $$props, $$slots);
  Astro2.self = $$MenuIcon;
  const { color = "#454C52", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"${addAttribute(color, "color")}${spreadAttributes(props)}> <path d="M2.75257 17.9997H21.2526C21.6668 17.9997 22.0026 18.3355 22.0026 18.7497C22.0026 19.1294 21.7204 19.4432 21.3543 19.4928L21.2526 19.4997H2.75257C2.33835 19.4997 2.00257 19.1639 2.00257 18.7497C2.00257 18.37 2.28472 18.0562 2.6508 18.0065L2.75257 17.9997H21.2526H2.75257ZM2.75257 11.5027H21.2526C21.6668 11.5027 22.0026 11.8385 22.0026 12.2527C22.0026 12.6324 21.7204 12.9462 21.3543 12.9959L21.2526 13.0027H2.75257C2.33835 13.0027 2.00257 12.6669 2.00257 12.2527C2.00257 11.873 2.28472 11.5592 2.6508 11.5095L2.75257 11.5027H21.2526H2.75257ZM2.75171 5.00293H21.2517C21.6659 5.00293 22.0017 5.33872 22.0017 5.75293C22.0017 6.13263 21.7196 6.44642 21.3535 6.49608L21.2517 6.50293H2.75171C2.3375 6.50293 2.00171 6.16714 2.00171 5.75293C2.00171 5.37323 2.28386 5.05944 2.64994 5.00978L2.75171 5.00293H21.2517H2.75171Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/MenuIcon.astro", void 0);

const $$Astro$p = createAstro("https://example.com");
const $$CopyIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$p, $$props, $$slots);
  Astro2.self = $$CopyIcon;
  const { color = "#596066", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"${addAttribute(color, "color")}${spreadAttributes(props)}> <rect x="6.99792" y="6.99792" width="14.0058" height="14.0058" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></rect> <path d="M6.99788 17.002H4.99705C3.89202 17.002 2.99622 16.1062 2.99622 15.0012V4.99705C2.99622 3.89202 3.89202 2.99622 4.99705 2.99622H15.0012C16.1062 2.99622 17.002 3.89202 17.002 4.99705V6.99788" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/CopyIcon.astro", void 0);

const $$Astro$o = createAstro("https://example.com");
const $$ShareBoxContent = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$o, $$props, $$slots);
  Astro2.self = $$ShareBoxContent;
  const { url, class: className, ...props } = Astro2.props;
  const refinedUrl = "http://localhost:4321/" + url;
  return renderTemplate`${renderComponent($$result, "modal-component", "modal-component", { "id": "share-modal-content", "class": twMerge(["absolute top-[calc(100%_+_8px)] left-0 w-screen lg:max-w-[400px] p-16 bg-white rounded-md border border-gray-200 hidden flex-col justify-start items-start gap-8 z-50 shadow-xl ", className]), ...props }, { "default": () => renderTemplate` ${maybeRenderHead()}<div class="self-stretch flex justify-start items-start gap-8"> <div class="flex-1 self-stretch p-10 rounded-sm border border-gray-200 flex justify-start items-center gap-10 overflow-scroll"> <span class="text-gray-600 text-sm font-normal whitespace-nowrap">${refinedUrl}</span> </div> <button class="p-10 bg-white rounded-sm overflow-hidden border border-gray-200 flex justify-start items-start gap-8 text-icon-soft hover:text-icon-sub"> ${renderComponent($$result, "CopyIcon", $$CopyIcon, { "color": "currentColor" })} </button> </div> <!-- <div class="self-stretch border border-gray.100 flex justify-start items-start">
    <div class="flex-1 h-[64px] px-[12px] py-[24px] border-r border-gray.100 flex justify-center items-center gap-10">
      <div class="w-[24px] h-[24px] relative">
        <div class="w-[24px] h-[24px] absolute">
          <div class="w-[18px] h-[18px] absolute left-[3px] top-[3px] rounded-[2px] border-[2px] border-gray.500"></div>
          <div class="w-[1px] h-[5.40px] absolute left-[7.62px] top-[11.10px] border-[2px] border-gray.500"></div>
          <div class="w-[8.60px] h-[8.94px] absolute left-[7.62px] top-[7.56px]">
            <div class="w-[4.50px] h-[5.40px] absolute left-[4.10px] top-[3.54px] border-[2px] border-gray.500"></div>
            <div class="w-[1px] h-[1px] absolute left-0 top-0 border-[2px] border-gray.500"></div>
          </div>
          <div class="w-[24px] h-[24px] absolute transform -rotate-90 origin-top-left"></div>
        </div>
      </div>
    </div>
    <div class="flex-1 h-[64px] px-[12px] py-[24px] bg-gray.50 border-r border-gray.100 flex justify-center items-center gap-10">
      <div class="w-[24px] h-[24px] relative">
        <div class="w-[24px] h-[24px] absolute">
          <div class="w-[4.50px] h-[1px] absolute left-[9.75px] top-[11px] border-[2px] border-gray.700"></div>
          <div class="w-[3px] h-[9px] absolute left-[11.25px] top-[7.50px] border-[2px] border-gray.700"></div>
          <div class="w-[18px] h-[18px] absolute left-[3px] top-[3px] rounded-[5px] border-[2px] border-gray.700"></div>
        </div>
      </div>
    </div>
    <div class="flex-1 h-[64px] px-[12px] py-[24px] border-r border-gray.100 flex justify-center items-center gap-10">
      <div class="w-[24px] h-[24px] relative">
        <div class="w-[24px] h-[24px] absolute">
          <div class="w-[17.51px] h-[17.59px] absolute left-[3.24px] top-[3.21px] border-[2px] border-gray.500"></div>
          <div class="w-[9px] h-[9px] absolute left-[7.50px] top-[7.50px]">
            <div class="w-[3.41px] h-[3.01px] absolute left-[5.60px] top-[5.34px] border-[2px] border-gray.500"></div>
            <div class="w-[3.01px] h-[3.40px] absolute left-[0.65px] top-0 border-[2px] border-gray.500"></div>
            <div class="w-[5.93px] h-[2.39px] absolute left-[2.39px] top-[6.61px] border-[2px] border-gray.500"></div>
            <div class="w-[2.39px] h-[5.93px] absolute left-0 top-[0.68px] border-[2px] border-gray.500"></div>
            <div class="w-[2.65px] h-[2.65px] absolute left-[2.94px] top-[3.40px] border-[2px] border-gray.500"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 h-[64px] px-[12px] py-[24px] border-r border-gray.100 flex justify-center items-center gap-10">
      <div class="w-[24px] h-[24px] relative">
        <div class="w-[24px] h-[24px] absolute">
          <img class="w-[18px] h-[15.30px] absolute left-[3px] top-[4.85px] border-[2px] border-gray.500" src="https://via.placeholder.com/18x15" />
          <div class="w-[24px] h-[24px] absolute transform -rotate-90 origin-top-left"></div>
        </div>
      </div>
    </div>
  </div> --> ` })} `;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/ShareBoxContent.astro", void 0);

const $$Astro$n = createAstro("https://example.com");
const $$MenuBoxContent = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$n, $$props, $$slots);
  Astro2.self = $$MenuBoxContent;
  const { titles } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="menu-modal-content" class="hidden p-16 bg-white rounded-lg border border-gray-300 flex-col justify-start items-start gap-2 absolute top-0 left-[calc(100%_+_8px)] shadow-lg data-[active]:flex"> <div class="flex flex-col justify-start items-center gap-12"> <p class="text-gray-800 text-2xl font-medium">Índice</p> <div class="p-24 bg-white rounded-lg border border-gray-200 flex flex-col justify-center items-start gap-24 max-h-[400px] overflow-scroll"> ${titles.map((item, index) => renderTemplate`<div class="flex justify-start items-start gap-8"> <div class="h-24 px-8 bg-primary-lighter rounded-full flex justify-center items-center"> <div class="text-center text-primary-base text-base font-semibold leading-6">${index + 1}</div> </div> <a${addAttribute(`link-to-${item}`, "id")} class="text-gray-800 text-base font-medium leading-6 w-max">${item}</a> </div>`)} </div> </div> </div> `;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/MenuBoxContent.astro", void 0);

const $$Astro$m = createAstro("https://example.com");
const $$Menu = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$Menu;
  const { idArticle, likes, url, titles } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="modal-background" class="absolute top-0 hidden z-40 left-0 w-full h-full data-[active]:block"></div> <div class="top-[200px] mt-[-12px] sticky flex flex-col items-center gap-56 max-w-72 flex-1 text-gray-600 hover:text-black z-40"> ${renderComponent($$result, "menu-button", "menu-button", { "data-id": idArticle, "class": "text-text-soft hover:text-text-sub data-[active]:text-text-sub" }, { "default": () => renderTemplate` <button class="transition-colors"> ${renderComponent($$result, "MenuIcon", $$MenuIcon, { "color": "currentColor" })} </button> ${renderComponent($$result, "MenuBoxContent", $$MenuBoxContent, { "titles": titles })} ` })} ${renderComponent($$result, "like-button", "like-button", { "data-id": idArticle, "class": "flex flex-col items-center gap-4 self-stretch group text-gray-600 hover:text-black" }, { "default": () => renderTemplate` <button class="transition-colors"> ${renderComponent($$result, "HearthIcon", $$HearthIcon, { "id": "hearth-icon", "color": "currentColor" })} ${renderComponent($$result, "HearthFullIcon", $$HearthFullIcon, { "id": "hearth-full-icon", "class": "hidden" })} </button> <span class="text-sm font-medium transition-colors">${likes}</span> ` })} <!-- <div class="flex flex-col items-center gap-4 self-stretch group text-gray-600 hover:text-black">
    <button class="transition-colors">
      <CommentsIcon id={'comment-icon'} color="currentColor" />
      <CommentsFullIcon id={'comment-full-icon'} />
    </button>
    <span class="text-sm font-medium transition-colors">999999</span>
  </div> --> ${renderComponent($$result, "share-button", "share-button", { "data-id": idArticle, "class": "flex relative flex-col items-center gap-4 self-stretch group text-gray-600 hover:text-black" }, { "default": () => renderTemplate` <button class="transition-colors"> ${renderComponent($$result, "ShareIcon", $$ShareIcon, { "id": "share-icon", "color": "currentColor" })} ${renderComponent($$result, "ShareFullIcon", $$ShareFullIcon, { "id": "share-full-icon", "class": "hidden" })} </button> <!-- <span class="text-sm font-medium transition-colors">{shares}</span> --> ${renderComponent($$result, "ShareBoxContent", $$ShareBoxContent, { "url": url })} ` })} </div> `;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/article-page/Menu.astro", void 0);

const $$Astro$l = createAstro("https://example.com");
const $$ArticleFeedback = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$ArticleFeedback;
  const { usefullCount, id } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "feedback-component", "feedback-component", { "data-id": id, "class": "p-24 bg-primary-lighter rounded-md border border-primary-light flex flex-col justify-start items-center gap-16 self-stretch" }, { "default": () => renderTemplate` ${maybeRenderHead()}<p class="text-primary-dark text-xl font-normal break-words">Esse artigo foi últil</p> <div class="flex justify-center items-start gap-8"> <button id="add-usefull-count" class="px-[18px] py-10 bg-primary-base rounded-xs flex justify-center items-center gap-8 data-[active]:bg-primary-dark"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path d="M12.0001 1.99902C17.5238 1.99902 22.0016 6.47687 22.0016 12.0006C22.0016 17.5243 17.5238 22.0021 12.0001 22.0021C6.47638 22.0021 1.99854 17.5243 1.99854 12.0006C1.99854 6.47687 6.47638 1.99902 12.0001 1.99902ZM12.0001 3.49902C7.30481 3.49902 3.49854 7.3053 3.49854 12.0006C3.49854 16.6959 7.30481 20.5021 12.0001 20.5021C16.6954 20.5021 20.5016 16.6959 20.5016 12.0006C20.5016 7.3053 16.6954 3.49902 12.0001 3.49902ZM8.46183 14.7839C9.31096 15.8616 10.602 16.5021 12.0001 16.5021C13.3963 16.5021 14.6858 15.8633 15.535 14.7881C15.7918 14.463 16.2634 14.4076 16.5884 14.6644C16.9135 14.9211 16.9689 15.3927 16.7122 15.7178C15.5814 17.1495 13.8602 18.0021 12.0001 18.0021C10.1374 18.0021 8.4142 17.1472 7.2836 15.7122C7.02725 15.3869 7.08319 14.9153 7.40855 14.6589C7.73391 14.4026 8.20548 14.4585 8.46183 14.7839ZM9.00053 8.75121C9.6905 8.75121 10.2498 9.31054 10.2498 10.0005C10.2498 10.6905 9.6905 11.2498 9.00053 11.2498C8.31057 11.2498 7.75124 10.6905 7.75124 10.0005C7.75124 9.31054 8.31057 8.75121 9.00053 8.75121ZM15.0005 8.75121C15.6905 8.75121 16.2498 9.31054 16.2498 10.0005C16.2498 10.6905 15.6905 11.2498 15.0005 11.2498C14.3106 11.2498 13.7512 10.6905 13.7512 10.0005C13.7512 9.31054 14.3106 8.75121 15.0005 8.75121Z" fill="white"></path> </svg> <div class="text-white text-lg font-medium break-words">Sim</div> </button> <button id="add-useless-count" class="px-[18px] py-10 bg-primary-base rounded-xs flex justify-center items-center gap-8 data-[active]:bg-primary-dark"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path d="M12 2.00439C17.5228 2.00439 22 6.48155 22 12.0044C22 17.5272 17.5228 22.0044 12 22.0044C6.47715 22.0044 2 17.5272 2 12.0044C2 6.48155 6.47715 2.00439 12 2.00439ZM12 3.50439C7.30558 3.50439 3.5 7.30997 3.5 12.0044C3.5 16.6988 7.30558 20.5044 12 20.5044C16.6944 20.5044 20.5 16.6988 20.5 12.0044C20.5 7.30997 16.6944 3.50439 12 3.50439ZM12 13.4978C13.6312 13.4978 15.1604 14.1527 16.281 15.2932C16.5714 15.5887 16.5672 16.0635 16.2717 16.3538C15.9763 16.6441 15.5014 16.64 15.2111 16.3445C14.3696 15.4881 13.2247 14.9978 12 14.9978C10.7726 14.9978 9.62535 15.4903 8.78348 16.35C8.49367 16.646 8.01882 16.651 7.72287 16.3611C7.42693 16.0713 7.42195 15.5965 7.71175 15.3005C8.83296 14.1556 10.3652 13.4978 12 13.4978ZM7.16435 6.78125C7.39958 6.48721 7.81102 6.41714 8.1269 6.60123L8.21852 6.66412L10.7185 8.66412C11.042 8.92288 11.0944 9.39485 10.8357 9.71829C10.6876 9.9034 10.4696 9.99974 10.2497 9.9998C10.2497 10.6902 9.69041 11.2495 9.00045 11.2495C8.31048 11.2495 7.75116 10.6902 7.75116 10.0002C7.75116 9.47405 8.07645 9.02385 8.5369 8.83976L7.28148 7.83542C6.95803 7.57666 6.90559 7.1047 7.16435 6.78125ZM13.2825 8.66422L15.7813 6.66422C16.1047 6.40539 16.5767 6.45773 16.8355 6.78112C17.0708 7.07511 17.049 7.4919 16.8001 7.75971L16.7187 7.83532L15.4632 8.83944C15.9241 9.02334 16.2497 9.47375 16.2497 10.0002C16.2497 10.6902 15.6904 11.2495 15.0004 11.2495C14.3536 11.2495 13.8216 10.7579 13.7576 10.128L13.7512 9.99818C13.5317 9.99979 13.3137 9.9035 13.1656 9.71842C12.9303 9.42443 12.9522 9.00764 13.2011 8.73983L13.2825 8.66422L15.7813 6.66422L13.2825 8.66422Z" fill="white"></path> </svg> <div class="text-white text-lg font-medium break-words">Não</div> </button> </div> <div> <span id="usefull-count" class="text-primary-dark text-sm font-bold break-words">${usefullCount} usuários</span> <span class="text-primary-dark text-sm font-normal break-words"> acharam esse artigo útil</span> </div> ` })} `;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/article-page/ArticleFeedback.astro", void 0);

async function fetchApi({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList
}) {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }
  const url = new URL(`${"http://localhost:1337"}/api/${endpoint}`);
  let queryString = "";
  if (query) {
    queryString = qs.stringify(query, { encode: false });
  }
  const res = await fetch(url.toString() + `${query ? "?" + queryString : ""}`, {
    headers: { Authorization: `Bearer ${"0c7be662cd4178bf441ac79a8c1691f18d2988285e4184291ce071691e41f8083062e1c419bb064237b1e1ef43c97a41bab774b45b63f720b076383687551c0fdb2a89e07877349894b71156b88789a4a57e94ea42bf67b6d0087272c70efa04db2219d68eb6d343754b4f97fef054ad851eff628a2d8c149bdb010e61c0d805"}` }
  });
  let data = await res.json();
  if (wrappedByKey) {
    data = data[wrappedByKey];
  }
  if (wrappedByList) {
    data = data[0];
  }
  return data;
}

const $$Astro$k = createAstro("https://example.com");
const $$ArrowLeftIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$ArrowLeftIcon;
  const { color = "#7367F0", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"${addAttribute(color, "color")}${spreadAttributes(props)}> <path d="M7.73925 2.45567C7.56429 2.28902 7.28736 2.29576 7.12071 2.47071C6.95406 2.64567 6.9608 2.9226 7.13575 3.08925L10.7824 6.56277H2.1875C1.94588 6.56277 1.75 6.75865 1.75 7.00027C1.75 7.2419 1.94588 7.43777 2.1875 7.43777H10.7825L7.13575 10.9114C6.9608 11.078 6.95406 11.3549 7.12071 11.5299C7.28736 11.7048 7.56429 11.7116 7.73925 11.5449L12.067 7.42269C12.1655 7.32883 12.2238 7.20911 12.2419 7.08464C12.2472 7.05734 12.25 7.02914 12.25 7.00027C12.25 6.97136 12.2472 6.9431 12.2418 6.91575C12.2237 6.79136 12.1654 6.67172 12.067 6.57792L7.73925 2.45567Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/ArrowLeftIcon.astro", void 0);

const $$Astro$j = createAstro("https://example.com");
const $$InstagramIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$InstagramIcon;
  const { color = "#C13584", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"${addAttribute(color, "color")}${spreadAttributes(props)}> <path d="M8 3.40625C6 3.40625 4.40625 5.03125 4.40625 7C4.40625 9 6 10.5938 8 10.5938C9.96875 10.5938 11.5938 9 11.5938 7C11.5938 5.03125 9.96875 3.40625 8 3.40625ZM8 9.34375C6.71875 9.34375 5.65625 8.3125 5.65625 7C5.65625 5.71875 6.6875 4.6875 8 4.6875C9.28125 4.6875 10.3125 5.71875 10.3125 7C10.3125 8.3125 9.28125 9.34375 8 9.34375ZM12.5625 3.28125C12.5625 3.75 12.1875 4.125 11.7188 4.125C11.25 4.125 10.875 3.75 10.875 3.28125C10.875 2.8125 11.25 2.4375 11.7188 2.4375C12.1875 2.4375 12.5625 2.8125 12.5625 3.28125ZM14.9375 4.125C14.875 3 14.625 2 13.8125 1.1875C13 0.375 12 0.125 10.875 0.0625C9.71875 0 6.25 0 5.09375 0.0625C3.96875 0.125 3 0.375 2.15625 1.1875C1.34375 2 1.09375 3 1.03125 4.125C0.96875 5.28125 0.96875 8.75 1.03125 9.90625C1.09375 11.0312 1.34375 12 2.15625 12.8438C3 13.6562 3.96875 13.9062 5.09375 13.9688C6.25 14.0312 9.71875 14.0312 10.875 13.9688C12 13.9062 13 13.6562 13.8125 12.8438C14.625 12 14.875 11.0312 14.9375 9.90625C15 8.75 15 5.28125 14.9375 4.125ZM13.4375 11.125C13.2188 11.75 12.7188 12.2188 12.125 12.4688C11.1875 12.8438 9 12.75 8 12.75C6.96875 12.75 4.78125 12.8438 3.875 12.4688C3.25 12.2188 2.78125 11.75 2.53125 11.125C2.15625 10.2188 2.25 8.03125 2.25 7C2.25 6 2.15625 3.8125 2.53125 2.875C2.78125 2.28125 3.25 1.8125 3.875 1.5625C4.78125 1.1875 6.96875 1.28125 8 1.28125C9 1.28125 11.1875 1.1875 12.125 1.5625C12.7188 1.78125 13.1875 2.28125 13.4375 2.875C13.8125 3.8125 13.7188 6 13.7188 7C13.7188 8.03125 13.8125 10.2188 13.4375 11.125Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/InstagramIcon.astro", void 0);

const $$Astro$i = createAstro("https://example.com");
const $$TiktokIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$TiktokIcon;
  const { color = "#24292E", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg"${addAttribute(color, "color")} width="24" height="24" viewBox="0 0 24 24" fill="none"${spreadAttributes(props)}> <path d="M18.1154 6.00894C17.0381 5.30651 16.2605 4.18262 16.018 2.87246C15.9656 2.5894 15.9368 2.29807 15.9368 2H12.4984L12.4929 15.78C12.435 17.3231 11.165 18.5616 9.60804 18.5616C9.12413 18.5616 8.66848 18.4406 8.26729 18.2295C7.3473 17.7454 6.71771 16.781 6.71771 15.6713C6.71771 14.0775 8.01437 12.7808 9.60804 12.7808C9.90553 12.7808 10.1909 12.8299 10.4609 12.9145V9.40424C10.1815 9.3662 9.89765 9.34242 9.60804 9.34242C6.11829 9.34242 3.2793 12.1816 3.2793 15.6713C3.2793 17.8124 4.34905 19.7072 5.98108 20.853C7.00906 21.5747 8.25948 22 9.60804 22C13.0978 22 15.9368 19.161 15.9368 15.6713V8.68367C17.2854 9.65161 18.9376 10.222 20.7205 10.222V6.7836C19.7601 6.7836 18.8656 6.49808 18.1154 6.00894Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/TiktokIcon.astro", void 0);

const $$Astro$h = createAstro("https://example.com");
const $$WebsiteIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$WebsiteIcon;
  const { color = "#2F4F4F", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"${addAttribute(color, "color")}${spreadAttributes(props)}> <path d="M11 8C11 8.71875 10.9375 9.375 10.875 10H5.09375C5.03125 9.375 4.96875 8.71875 4.96875 8C4.96875 7.3125 5.03125 6.65625 5.09375 6H10.875C10.9375 6.65625 11 7.3125 11 8ZM15.7188 6C15.9062 6.65625 16 7.3125 16 8C16 8.71875 15.9062 9.375 15.7188 10H11.875C11.9375 9.375 12 8.6875 12 8C12 7.3125 11.9375 6.65625 11.875 6H15.7188ZM15.4062 5H11.75C11.4375 3.03125 10.8125 1.34375 10.0312 0.28125C12.4688 0.9375 14.4688 2.6875 15.4062 5ZM10.75 5H5.21875C5.40625 3.875 5.71875 2.875 6.0625 2.0625C6.40625 1.3125 6.75 0.78125 7.125 0.4375C7.46875 0.125 7.75 0 8 0C8.21875 0 8.5 0.125 8.84375 0.4375C9.21875 0.78125 9.5625 1.3125 9.90625 2.0625C10.25 2.875 10.5625 3.875 10.75 5ZM0.5625 5C1.5 2.6875 3.5 0.9375 5.9375 0.28125C5.15625 1.34375 4.53125 3.03125 4.21875 5H0.5625ZM4.09375 6C4.03125 6.65625 3.96875 7.3125 3.96875 8C3.96875 8.6875 4.03125 9.375 4.09375 10H0.25C0.0625 9.375 0 8.71875 0 8C0 7.3125 0.0625 6.65625 0.25 6H4.09375ZM6.0625 13.9688C5.71875 13.1562 5.40625 12.1562 5.21875 11H10.75C10.5625 12.1562 10.25 13.1562 9.90625 13.9688C9.5625 14.7188 9.21875 15.25 8.84375 15.5938C8.5 15.9062 8.21875 16 7.96875 16C7.75 16 7.46875 15.9062 7.125 15.5938C6.75 15.25 6.40625 14.7188 6.0625 13.9688ZM5.9375 15.75C3.5 15.0938 1.5 13.3438 0.5625 11H4.21875C4.53125 13 5.15625 14.6875 5.9375 15.75ZM10.0312 15.75C10.8125 14.6875 11.4375 13 11.75 11H15.4062C14.4688 13.3438 12.4688 15.0938 10.0312 15.75Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/WebsiteIcon.astro", void 0);

const $$Astro$g = createAstro("https://example.com");
const $$YoutubeIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$YoutubeIcon;
  const { color = "#FF0000", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"${addAttribute(color, "color")}${spreadAttributes(props)}> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.792 5.41483C20.6521 5.64589 21.3325 6.32626 21.5635 7.18633C21.9872 8.75244 22 12.0002 22 12.0002C22 12.0002 22 15.2608 21.5764 16.8141C21.3453 17.6741 20.665 18.3545 19.8049 18.5856C18.2516 19.0092 12 19.0092 12 19.0092C12 19.0092 5.74839 19.0092 4.19512 18.5856C3.33504 18.3545 2.65469 17.6741 2.42362 16.8141C2 15.248 2 12.0002 2 12.0002C2 12.0002 2 8.75244 2.41078 7.19917C2.64185 6.33909 3.32221 5.65873 4.18229 5.42767C5.73556 5.00404 11.9872 4.99121 11.9872 4.99121C11.9872 4.99121 18.2388 4.99121 19.792 5.41483ZM15.1836 12.0002L9.99743 15.004V8.99635L15.1836 12.0002Z" fill="#24292E"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/YoutubeIcon.astro", void 0);

const $$Astro$f = createAstro("https://example.com");
const $$TwitterIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$TwitterIcon;
  const { color = "#1DA1F2", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"${addAttribute(color, "color")}${spreadAttributes(props)}> <path d="M14.7747 3.77062C14.2657 3.99575 13.726 4.1436 13.1734 4.20928C13.7559 3.86091 14.1918 3.31263 14.4 2.66662C13.8534 2.99195 13.254 3.21995 12.6294 3.34328C12.2098 2.89434 11.6536 2.59659 11.0473 2.49634C10.4411 2.39609 9.81866 2.49895 9.27688 2.78892C8.7351 3.07889 8.30429 3.53974 8.05144 4.09981C7.7986 4.65989 7.73787 5.2878 7.8787 5.88595C6.77011 5.83039 5.68559 5.5423 4.69556 5.04039C3.70553 4.53849 2.83212 3.83398 2.13204 2.97262C1.88423 3.39825 1.75401 3.8821 1.7547 4.37462C1.7547 5.34128 2.2467 6.19528 2.9947 6.69528C2.55204 6.68135 2.11912 6.56181 1.73204 6.34662V6.38128C1.73217 7.02508 1.95495 7.64903 2.3626 8.14732C2.77025 8.64562 3.33769 8.9876 3.9687 9.11528C3.55778 9.22664 3.12691 9.24306 2.7087 9.16328C2.88661 9.71744 3.23337 10.2021 3.70043 10.5494C4.16749 10.8966 4.73145 11.0891 5.31337 11.1C4.73502 11.5542 4.07282 11.8899 3.36462 12.0881C2.65642 12.2862 1.91612 12.3428 1.18604 12.2546C2.4605 13.0742 3.9441 13.5094 5.45937 13.508C10.588 13.508 13.3927 9.25928 13.3927 5.57462C13.3927 5.45462 13.3894 5.33328 13.384 5.21462C13.9299 4.82006 14.4011 4.3313 14.7754 3.77128L14.7747 3.77062Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/TwitterIcon.astro", void 0);

const $$Astro$e = createAstro("https://example.com");
const $$FacebookIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$FacebookIcon;
  const { color = "#4267B2", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"${addAttribute(color, "color")}${spreadAttributes(props)}> <path d="M10.268 14V9.356H11.8233L12.056 7.55067H10.268V6.39867C10.268 5.876 10.4133 5.51933 11.1627 5.51933H12.1187V3.90467C11.6559 3.85556 11.1907 3.83175 10.7253 3.83333C9.34733 3.83333 8.404 4.67467 8.404 6.22V7.55067H6.84533V9.356H8.404V14H2.66667C2.48986 14 2.32029 13.9298 2.19526 13.8047C2.07024 13.6797 2 13.5101 2 13.3333V2.66667C2 2.48986 2.07024 2.32029 2.19526 2.19526C2.32029 2.07024 2.48986 2 2.66667 2H13.3333C13.5101 2 13.6797 2.07024 13.8047 2.19526C13.9298 2.32029 14 2.48986 14 2.66667V13.3333C14 13.5101 13.9298 13.6797 13.8047 13.8047C13.6797 13.9298 13.5101 14 13.3333 14H10.268V14Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/FacebookIcon.astro", void 0);

const $$Astro$d = createAstro("https://example.com");
const $$LinkedinIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$LinkedinIcon;
  const { color = "#0e76a8", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"${addAttribute(color, "color")}${spreadAttributes(props)}> <path d="M12.2233 12.226H10.4467V9.44133C10.4467 8.77733 10.4333 7.92267 9.52 7.92267C8.594 7.92267 8.45267 8.64533 8.45267 9.39267V12.226H6.67533V6.5H8.382V7.28H8.40533C8.644 6.83067 9.224 6.35533 10.0907 6.35533C11.8907 6.35533 12.224 7.54067 12.224 9.08267V12.226H12.2233ZM4.66867 5.71667C4.53304 5.71684 4.39871 5.69025 4.27338 5.6384C4.14804 5.58656 4.03418 5.51049 3.9383 5.41456C3.84243 5.31862 3.76644 5.20471 3.71467 5.07934C3.66291 4.95398 3.6364 4.81963 3.63667 4.684C3.6368 4.47989 3.69745 4.2804 3.81096 4.11076C3.92447 3.94113 4.08573 3.80896 4.27435 3.73097C4.46298 3.65298 4.67049 3.63268 4.87065 3.67263C5.07082 3.71258 5.25464 3.81098 5.39887 3.9554C5.54311 4.09983 5.64128 4.28377 5.68097 4.48399C5.72066 4.6842 5.70009 4.89169 5.62185 5.08021C5.54362 5.26873 5.41125 5.42983 5.24146 5.54311C5.07168 5.6564 4.87211 5.7168 4.668 5.71667H4.66867ZM5.55933 12.226H3.77733V6.5H5.56V12.226H5.55933ZM13.1133 2H2.886C2.39533 2 2 2.38667 2 2.86467V13.1353C2 13.6133 2.396 14 2.88533 14H13.1107C13.6 14 14 13.6133 14 13.1353V2.86467C14 2.38667 13.6 2 13.1107 2H13.1127H13.1133Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/LinkedinIcon.astro", void 0);

const $$Astro$c = createAstro("https://example.com");
const $$EmailIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$EmailIcon;
  const { color = "#24292E", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"${addAttribute(color, "color")}${spreadAttributes(props)}> <path d="M1.99992 2H13.9999C14.1767 2 14.3463 2.07024 14.4713 2.19526C14.5963 2.32029 14.6666 2.48986 14.6666 2.66667V13.3333C14.6666 13.5101 14.5963 13.6797 14.4713 13.8047C14.3463 13.9298 14.1767 14 13.9999 14H1.99992C1.82311 14 1.65354 13.9298 1.52851 13.8047C1.40349 13.6797 1.33325 13.5101 1.33325 13.3333V2.66667C1.33325 2.48986 1.40349 2.32029 1.52851 2.19526C1.65354 2.07024 1.82311 2 1.99992 2V2ZM8.03992 7.78867L3.76525 4.15867L2.90192 5.17467L8.04859 9.54467L13.1026 5.17133L12.2306 4.16267L8.04059 7.78867H8.03992Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/EmailIcon.astro", void 0);

const $$Astro$b = createAstro("https://example.com");
const $$Socials = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Socials;
  const { social, ...rest } = Astro2.props;
  let Icon;
  switch (social) {
    case "instagram":
      Icon = $$InstagramIcon;
      break;
    case "tiktok":
      Icon = $$TiktokIcon;
      break;
    case "website":
      Icon = $$WebsiteIcon;
      break;
    case "youtube":
      Icon = $$YoutubeIcon;
      break;
    case "twitter":
      Icon = $$TwitterIcon;
      break;
    case "facebook":
      Icon = $$FacebookIcon;
      break;
    case "linkedin":
      Icon = $$LinkedinIcon;
      break;
    case "github":
      Icon = $$WebsiteIcon;
      break;
    case "email":
      Icon = $$EmailIcon;
      break;
    default:
      Icon = $$WebsiteIcon;
      break;
  }
  return renderTemplate`${renderComponent($$result, "Icon", Icon, { ...rest })}`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/Socials.astro", void 0);

const $$Astro$a = createAstro("https://example.com");
const $$AuthorInfo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$AuthorInfo;
  const { author } = Astro2.props;
  const {
    pagination: { total }
  } = await fetchApi({
    endpoint: "articles",
    wrappedByKey: "meta",
    query: {
      filters: {
        author: {
          id: {
            $eq: author.id
          }
        }
      },
      fields: ["id"]
    }
  });
  return renderTemplate`${maybeRenderHead()}<div class="p-40 bg-text-gray-100 rounded-2xl overflow-hidden border border-border-soft justify-center lg:justify-start lg:items-start gap-32 lg:gap-48 flex self-stretch flex-col lg:flex-row"> <div class="flex flex-col justify-start items-center lg:items-start gap-16"> ${renderComponent($$result, "AuthorBoxAvatar", $$AuthorBoxAvatar, { "class": "w-[128px] h-[128px]", "src": author.attributes.avatar?.data.attributes.url, "name": author.attributes.name })} <div class="p-8 bg-text-gray-100 rounded-xs justify-start items-start gap-10 flex"> <div class="text-text-main text-sm font-semibold break-words">${total} publicações</div> </div> </div> <div class="flex-[1] flex flex-col justify-start items-start gap-24"> <div class="self-stretch h-48 flex flex-col justify-start items-start"> <div class="justify-start items-center gap-4 flex"> <div class="text-text-main text-lg font-bold break-words">${author.attributes.name}</div> </div> <div class="self-stretch text-text-soft text-sm font-semibold break-words"> ${author.attributes.jobTitle} </div> </div> <div class="self-stretch flex flex-col justify-start items-start gap-8"> <div class="self-stretch text-text-sub text-base font-normal break-words"> ${author.attributes.description} </div> <a${addAttribute("/a/" + author.attributes.slug, "href")} class="justify-start items-center gap-[12px] flex"> <div class="text-primary-base text-base font-normal break-words">Ver mais</div> <button class="w-[20px] h-[20px] rounded-full border border-primary-base justify-center items-center gap-8 flex"> ${renderComponent($$result, "ArrowLeftIcon", $$ArrowLeftIcon, {})} </button> </a> </div> </div> ${author.attributes.socials && renderTemplate`<div class="flex flex-col justify-start items-start gap-24"> <div class="text-text-main text-lg font-bold break-words">Redes sociais</div> <div class="self-stretch flex flex-col justify-start items-start gap-8"> ${author.attributes.socials.map((social) => renderTemplate`<a${addAttribute(social.url, "href")} class="justify-start items-center gap-4 flex"> ${renderComponent($$result, "Socials", $$Socials, { "social": social.type, "class": "size-16" })} <div class="text-text-main text-base font-normal break-words">${social.type}</div> </a>`)} </div> </div>`} </div>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/article-page/AuthorInfo.astro", void 0);

const $$Astro$9 = createAstro("https://example.com");
const $$Tag = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Tag;
  const { class: className, href: hrefRaw, ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute("/tags/" + hrefRaw, "href")}${addAttribute(twMerge(["p-8 bg-primary-lighter rounded-[4px] justify-center items-center gap-[4px] flex", className]), "class")}${spreadAttributes(props)}> <div class="text-primary-base text-base font-medium break-words">
#${renderSlot($$result, $$slots["default"])} </div> </a>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/Tag.astro", void 0);

const $$Astro$8 = createAstro("https://example.com");
const $$TagsAndShare = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$TagsAndShare;
  const { tags = [] } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="justify-between items-start lg:items-center flex self-stretch flex-col lg:flex-row gap-y-32"> <div class="flex items-center gap-16"> <div class="text-text-sub text-base font-normal break-words">Tags:</div> <div class="flex items-center gap-8"> ${tags.map((tag) => renderTemplate`${renderComponent($$result, "TagComponent", $$Tag, { "href": tag.attributes.slug }, { "default": ($$result2) => renderTemplate`${tag.attributes.name}` })}`)} </div> </div> <div class="flex items-center gap-16"> <div class="text-text-sub text-base font-medium break-words">
Compartilhar:
</div> <div class="flex items-center"> <button class="w-32 transition-colors h-32 rounded-[9999px] overflow-hidden hover:bg-primary-light flex items-center justify-center"> ${renderComponent($$result, "FacebookIcon", $$FacebookIcon, {})} </button> <button class="w-32 transition-colors h-32 rounded-[9999px] overflow-hidden hover:bg-primary-light flex items-center justify-center"> ${renderComponent($$result, "TwitterIcon", $$TwitterIcon, {})} </button> <button class="w-32 transition-colors h-32 rounded-[9999px] overflow-hidden hover:bg-primary-light flex items-center justify-center"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"> <path d="M12.2233 12.226H10.4467V9.44133C10.4467 8.77733 10.4333 7.92267 9.52 7.92267C8.594 7.92267 8.45267 8.64533 8.45267 9.39267V12.226H6.67533V6.5H8.382V7.28H8.40533C8.644 6.83067 9.224 6.35533 10.0907 6.35533C11.8907 6.35533 12.224 7.54067 12.224 9.08267V12.226H12.2233ZM4.66867 5.71667C4.53304 5.71684 4.39871 5.69025 4.27338 5.6384C4.14804 5.58656 4.03418 5.51049 3.9383 5.41456C3.84243 5.31862 3.76644 5.20471 3.71467 5.07934C3.66291 4.95398 3.6364 4.81963 3.63667 4.684C3.6368 4.47989 3.69745 4.2804 3.81096 4.11076C3.92447 3.94113 4.08573 3.80896 4.27435 3.73097C4.46298 3.65298 4.67049 3.63268 4.87065 3.67263C5.07082 3.71258 5.25464 3.81098 5.39887 3.9554C5.54311 4.09983 5.64128 4.28377 5.68097 4.48399C5.72066 4.6842 5.70009 4.89169 5.62185 5.08021C5.54362 5.26873 5.41125 5.42983 5.24146 5.54311C5.07168 5.6564 4.87211 5.7168 4.668 5.71667H4.66867ZM5.55933 12.226H3.77733V6.5H5.56V12.226H5.55933ZM13.1133 2H2.886C2.39533 2 2 2.38667 2 2.86467V13.1353C2 13.6133 2.396 14 2.88533 14H13.1107C13.6 14 14 13.6133 14 13.1353V2.86467C14 2.38667 13.6 2 13.1107 2H13.1127H13.1133Z" fill="#24292E"></path> </svg> </button> <button class="w-32 transition-colors h-32 rounded-[9999px] overflow-hidden hover:bg-primary-light flex items-center justify-center"> ${renderComponent($$result, "EmailIcon", $$EmailIcon, {})} </button> </div> </div> </div>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/article-page/TagsAndShare.astro", void 0);

const $$Astro$7 = createAstro("https://example.com");
const $$Pagination = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Pagination;
  const { prevArticle, nextArticle } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="pb-[48px] border-tl-8 border-tr-8 justify-center items-start gap-32 flex self-stretch"> <div class="flex-[1] flex flex-col justify-start items-start gap-12"> <p class="self-stretch text-text-soft text-sm font-semibold  break-words">Artigo anterior</p> <a${addAttribute(prevArticle.attributes.slug, "href")} class="self-stretch text-text-main text-lg font-semibold  break-words">${prevArticle.attributes.title}</a> </div> <div class="flex-[1] flex flex-col justify-start items-end gap-12"> <p class="self-stretch text-text-soft text-sm font-semibold break-words text-right">Próximo Artigo</p> <a${addAttribute(nextArticle.attributes.slug, "href")} class="self-stretch text-text-main text-lg font-semibold  break-words text-right">${nextArticle.attributes.title}</a> </div> </div>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/article-page/Pagination.astro", void 0);

const $$Astro$6 = createAstro("https://example.com");
const $$ChevronRightIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$ChevronRightIcon;
  const { color = "#718096", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"${addAttribute(color, "color")} viewBox="0 0 16 16" fill="none"${spreadAttributes(props)}> <path d="M8.78145 7.99999L5.48145 4.69999L6.42411 3.75732L10.6668 7.99999L6.42411 12.2427L5.48145 11.3L8.78145 7.99999Z" fill="currentColor"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/ChevronRightIcon.astro", void 0);

const $$Astro$5 = createAstro("https://example.com");
const $$HomeIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$HomeIcon;
  const { color = "#7367F0", ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg"${addAttribute(color, "color")} width="24" height="24" viewBox="0 0 24 24" fill="none"${spreadAttributes(props)}> <path d="M9.5 11.5H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9.5 15.5H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 16.5V10.9597C3 9.5927 3.62139 8.29979 4.68885 7.44582L8.8765 4.09568C10.7026 2.63477 13.2974 2.63477 15.1235 4.09568L19.3111 7.44581C20.3786 8.29978 21 9.59269 21 10.9597V16.5C21 18.9853 18.9853 21 16.5 21H7.5C5.01472 21 3 18.9853 3 16.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/icons/HomeIcon.astro", void 0);

const $$Astro$4 = createAstro("https://example.com");
const $$Breadcrumb = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Breadcrumb;
  const { items = [] } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="justify-start items-center gap-16 flex overflow-scroll w-full"> ${renderComponent($$result, "HomeIcon", $$HomeIcon, {})} <div class="flex items-center gap-[8px]"> <div class="p-2 rounded-sm justify-center items-center gap-10 flex"> <a href="/" class="text-text-soft text-small font-normal break-words hover:text-text-sub ">Início</a> </div> ${items.map((item, index) => {
    const classTemp = index === items.length - 1 ? "text-primary-base font-normal whitespace-nowrap hover:text-primary-dark" : "text-text-soft font-normal whitespace-nowrap hover:text-text-sub";
    return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ChevronRightIcon", $$ChevronRightIcon, {})} <div class="flex items-start gap-8"> ${item instanceof Array ? item.map((subitem, subindex) => {
      const Component = subitem.url ? "a" : "p";
      return renderTemplate`<div${addAttribute(twMerge([classTemp, "hover:text-none"]), "class")}> ${subindex === 0 ? "" : "/"} ${renderComponent($$result2, "Component", Component, { "href": subitem.url, "class": twMerge([classTemp]) }, { "default": ($$result3) => renderTemplate`${subitem.title}` })} </div>`;
    }) : item.url ? renderTemplate`<a${addAttribute(item.url, "href")}${addAttribute(twMerge([classTemp]), "class")}> ${item.title} </a>` : renderTemplate`<p${addAttribute(twMerge([classTemp]), "class")}> ${item.title} </p>`} </div> ` })}`;
  })} </div> </div>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/Breadcrumb.astro", void 0);

const $$Astro$3 = createAstro("https://example.com");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Footer;
  const { brand, description, name, socials } = Astro2.props;
  const today = /* @__PURE__ */ new Date();
  return renderTemplate`${maybeRenderHead()}<footer> ${renderComponent($$result, "Screen", $$Screen, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, { "class": "flex-col gap-40 py-64" }, { "default": ($$result3) => renderTemplate` <div class="flex items-start gap-12"> <div class="w-[295px] flex flex-col justify-start items-start gap-32"> ${renderComponent($$result3, "ApiImage", $$ApiImage, { "image": brand, "class": "w-[139px] lg:w-[186px]" })} <div class="text-text-sub text-sm font-normal break-words"> ${description} </div> <div class="flex justify-start items-start gap-24"> ${socials.map((social) => renderTemplate`<a${addAttribute(social.url, "href")} target="_blank"> ${renderComponent($$result3, "SocialsComponent", $$Socials, { "social": social.type, "class": "size-24 text-icon-strong" })} </a>`)} </div> </div> </div> <div class="w-full h-[1px] bg-border-soft"></div> <div class="justify-between items-center flex w-full flex-col lg:flex-row gap-y-16"> <div class="text-text-main text-sm font-normal break-words">
© ${today.getFullYear()} ${name} </div> <div class="flex gap-32"> <div class="text-text-main text-sm font-normal break-words">Política de Privacidade</div> <div class="text-text-main text-sm font-normal break-words">Política de Cookies</div> </div> </div> ` })} ` })} </footer>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/Footer.astro", void 0);

const $$Astro$2 = createAstro("https://example.com");
const $$NewsLetter = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$NewsLetter;
  return renderTemplate`${renderComponent($$result, "Screen", $$Screen, { "class": "relative bg-primary-dark overflow-visible" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, { "class": "items-center  flex-col lg:flex-row" }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<h2 class="font-semibold self-stretch flex-1 text-white">Inscreva-se na newsletter</h2> <div class="self-stretch lg:w-[592px] py-8 px-24 pr-8 bg-white rounded-lg border border-primary-300 justify-between items-center flex gap-8"> <input type="email" class="text-icon-soft text-lg font-normal break-words self-stretch w-full focus:outline-none" placeholder="Insira seu e-mail"> <button class="flex-1 px-24 py-10 bg-primary-base rounded-sm border border-primary-base justify-center items-center gap-8 flex"> <div class="text-white text-base font-medium text-nowrap">vamos conversar</div> </button> </div> ` })} ` })}`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/NewsLetter.astro", void 0);

const getStyleBackgroundImage = (url) => {
  if (url)
    return `background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 27.39%, #000 100%), url("${url}") lightgray 50% / cover no-repeat;`;
  return `background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%), linear-gradient(0deg, var(--primary-500) 0%, var(--primary-500) 100%);`;
};

const $$Astro$1 = createAstro("https://example.com");
const $$ArticleContent = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ArticleContent;
  const { content } = Astro2.props;
  const titlesWithId = content.replace(/<h1>(.*?)<\/h1>/g, '<h1 id="$1">$1</h1>');
  return renderTemplate`${maybeRenderHead()}<article${addAttribute("article-content", "id")} class="prose max-w-[none] prose-sm lg:prose-lg lg:max-w-full flex-1">${unescapeHTML(titlesWithId)}</article>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/article-page/ArticleContent.astro", void 0);

const $$Astro = createAstro("https://example.com");
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const blogInfo = await fetchApi({
    endpoint: "blog-info",
    query: {
      populate: "*"
    }
  });
  const postData = await fetchApi({
    endpoint: "/articles",
    wrappedByList: true,
    wrappedByKey: "data",
    query: {
      filters: {
        slug: {
          $eq: slug
        }
      },
      populate: {
        author: {
          fields: "*",
          populate: "*"
        },
        mainImage: "*",
        categories: "*",
        tags: "*",
        relatedArticles: "*"
      },
      publicationState: "live"
    }
  });
  if (!postData || postData === void 0) {
    Astro2.redirect("/404");
  }
  const prevId = postData.id === 1 ? postData.id + 2 : postData.id - 1;
  const nextArticle = await fetchApi({
    endpoint: `/articles/${postData.id + 1}`,
    wrappedByKey: "data",
    query: {
      fields: ["slug", "title"],
      publicationState: "live"
    }
  });
  const prevArticle = await fetchApi({
    endpoint: `/articles/${prevId}`,
    wrappedByKey: "data",
    query: {
      fields: ["slug", "title"],
      publicationState: "live"
    }
  });
  const safePrevArticle = await fetchApi({
    endpoint: `/articles`,
    wrappedByKey: "data",
    wrappedByList: true,
    query: {
      fields: ["slug", "title"],
      publicationState: "live",
      pagination: {
        pageSize: 1,
        page: 1
      }
    }
  });
  const safeNextArticle = await fetchApi({
    endpoint: `/articles`,
    wrappedByKey: "data",
    wrappedByList: true,
    query: {
      fields: ["slug", "title"],
      publicationState: "live",
      pagination: {
        pageSize: 1,
        page: 2
      }
    }
  });
  const imgUrl = `${process.env.NODE_ENV === "development" ? "http://localhost:1337" : ""}`;
  const def = postData.attributes.mainImage.data ? await getImage({
    src: imgUrl + postData.attributes.mainImage.data.attributes.url,
    width: postData.attributes.mainImage.data.attributes.width,
    height: postData.attributes.mainImage.data.attributes.height,
    format: "webp",
    inferSize: true
  }) : void 0;
  const categories = postData.attributes.categories.data || [];
  const h1List = postData.attributes.content.match(/<h1>(.*?)<\/h1>/g)?.map((h1) => h1.replace(/<\/?h1>/g, "")) ?? [];
  return renderTemplate`<html lang="en"> <head>${renderComponent($$result, "BaseHead", $$BaseHead, { "title": SITE_TITLE, "description": SITE_DESCRIPTION })}${renderHead()}</head> <body> ${renderComponent($$result, "Header", $$Header, { "brand": blogInfo.data.attributes.brand.data })} ${renderComponent($$result, "Screen", $$Screen, { "class": "h-[424px] lg:h-[481px] justify-end relative", "style": getStyleBackgroundImage(def?.src) }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, { "class": "flex-col gap-32 lg:gap-64 pb-32 pt-80 lg:py-80" }, { "default": ($$result3) => renderTemplate` <div></div> <h1 class="font-semibold text-white text-center w-full"> ${postData.attributes.title} </h1> ${renderComponent($$result3, "AuthorComplement", $$AuthorComplement, { "author": postData.attributes.author.data, "date": postData.attributes.createdAt, "readingTime": postData.attributes.readingTime })} ` })} ` })} ${renderComponent($$result, "ProgressReading", $$ProgressReading, {})} ${renderComponent($$result, "Screen", $$Screen, { "class": "pl-0 relative justify-end" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, { "class": "gap-24 lg:gap-64" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Menu", $$Menu, { "titles": h1List, "idArticle": postData.id, "likes": postData.attributes.likes, "url": postData.attributes.slug })} <div class="flex flex-col gap-32 items-start flex-1 overflow-hidden"> ${renderComponent($$result3, "Breadcrumb", $$Breadcrumb, { "items": [
    categories?.map((category) => ({
      title: category.attributes.title,
      url: `/categoria/${category.attributes.slug}`
    })),
    { title: postData.attributes.title, url: postData.attributes.slug }
  ] })} ${renderComponent($$result3, "ArticleContent", $$ArticleContent, { "content": postData.attributes.content })} ${renderComponent($$result3, "ArticleFeedback", $$ArticleFeedback, { "id": postData.id, "usefullCount": postData.attributes.usefullCount })} ${renderComponent($$result3, "Pagination", $$Pagination, { "nextArticle": nextArticle ?? safeNextArticle, "prevArticle": prevArticle ?? safePrevArticle })} ${postData.attributes.author.data && renderTemplate`${renderComponent($$result3, "AuthorInfo", $$AuthorInfo, { "author": postData.attributes.author.data })}`} ${renderComponent($$result3, "TagsAndShare", $$TagsAndShare, { "tags": postData.attributes.tags.data })} </div> ` })} ` })} ${renderComponent($$result, "NewsLetter", $$NewsLetter, {})} ${renderComponent($$result, "Footer", $$Footer, { "brand": blogInfo.data.attributes.brand.data, "description": blogInfo.data.attributes.summary, "name": blogInfo.data.attributes.name, "socials": blogInfo.data.attributes.socials })} </body></html>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/pages/[slug].astro", void 0);
const $$file = "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/pages/[slug].astro";
const $$url = "/[slug]";

const _slug_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Screen as $, SITE_TITLE as S, _slug_ as _, getImage as a, getStyleBackgroundImage as b, $$Container as c, $$Header as d, $$Footer as e, fetchApi as f, getConfiguredImageService as g, $$BaseHead as h, imageConfig as i, SITE_DESCRIPTION as j, $$Image as k, $$HeaderLink as l };
