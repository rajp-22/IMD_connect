import { IKnowledgeChunk } from './types';
import { generateLocalSemanticEmbedding } from './embeddings';

/**
 * Approved Grounded Platform Knowledge Base for MeghSetu.
 * Represents official IMD syllabus, operational handbooks, competency frameworks,
 * and scientific guidelines.
 */
export const PLATFORM_KNOWLEDGE_DOCUMENTS = [
  {
    id: 'plat_imd_thermodynamics',
    name: 'IMD Atmospheric Thermodynamics & Upper-Air Sounding Manual',
    documentType: 'platform_handbook',
    totalPages: 120,
    detectedTopics: ['Atmospheric Thermodynamics', 'Tephigram', 'Convective Instability', 'CAPE & CIN'],
  },
  {
    id: 'plat_imd_nwp',
    name: 'IMD Numerical Weather Prediction (NWP) Modeling Framework Manual',
    documentType: 'platform_handbook',
    totalPages: 180,
    detectedTopics: ['Numerical Weather Prediction (NWP)', 'Navier-Stokes Equations', 'NCUM Global', 'Data Assimilation'],
  },
  {
    id: 'plat_imd_cyclone',
    name: 'Standard Operating Procedure (SOP) for Tropical Cyclone Warning (RSMC New Delhi)',
    documentType: 'platform_handbook',
    totalPages: 95,
    detectedTopics: ['Tropical Cyclones & Dvorak Technique', 'Curved Band Pattern', 'Storm Surge Warning'],
  },
  {
    id: 'plat_imd_aws',
    name: 'Surface Meteorological Observation & AWS Network Operations Manual',
    documentType: 'platform_handbook',
    totalPages: 85,
    detectedTopics: ['Automatic Weather Stations (AWS)', 'Sensor Calibration', 'INSAT Telemetry'],
  },
  {
    id: 'plat_imd_radar',
    name: 'Doppler Weather Radar (DWR) Operations & Nowcasting Guidelines',
    documentType: 'platform_handbook',
    totalPages: 110,
    detectedTopics: ['Radar Meteorology & Nowcasting', 'Reflectivity Z-R', 'Radial Velocity'],
  },
  {
    id: 'plat_imd_competency',
    name: 'IMD Scientific Cadre Competency Standards & Evaluation Framework (WMO-258)',
    documentType: 'syllabus',
    totalPages: 60,
    detectedTopics: ['Competency Standards', 'Operational Forecaster Certification', 'Syllabus'],
  },
];

interface RawPlatformSection {
  documentId: string;
  documentName: string;
  pageNumber: number;
  sectionTitle: string;
  content: string;
}

const RAW_PLATFORM_CHUNKS: RawPlatformSection[] = [
  // 1. Thermodynamics
  {
    documentId: 'plat_imd_thermodynamics',
    documentName: 'IMD Atmospheric Thermodynamics & Upper-Air Sounding Manual',
    pageNumber: 14,
    sectionTitle: 'Section 2.1: Hydrostatic Equation & Hypsometric Formula',
    content:
      'Atmospheric pressure decreases monotonically with altitude following the hydrostatic equation dp = -rho * g * dz. Integrating this relation using the ideal gas law yields the Hypsometric equation: h = z2 - z1 = (R_d * T_v_mean / g) * ln(p1 / p2). Forecasters use geopotential thickness to determine mean thermal advection and identify warm and cold cores in synoptic systems.',
  },
  {
    documentId: 'plat_imd_thermodynamics',
    documentName: 'IMD Atmospheric Thermodynamics & Upper-Air Sounding Manual',
    pageNumber: 38,
    sectionTitle: 'Section 4.3: Tephigram Plotting & Coordinate Transformations',
    content:
      'The IMD standard thermodynamic diagram is the Tephigram (T-phi gram), where temperature (T) and entropy (phi = c_p * ln(theta)) form orthogonal Cartesian axes rotated by 45 degrees. The area enclosed between the ascending parcel curve and environmental temperature sounding is directly proportional to buoyant energy: 1 square centimeter on an IMD chart corresponds to approximately 400 Joules per kilogram (J/kg) of convective work.',
  },
  {
    documentId: 'plat_imd_thermodynamics',
    documentName: 'IMD Atmospheric Thermodynamics & Upper-Air Sounding Manual',
    pageNumber: 42,
    sectionTitle: 'Section 4.5: Convective Available Potential Energy (CAPE) & CIN',
    content:
      'Convective Available Potential Energy (CAPE) measures the integrated positive buoyant energy of an air parcel from the Level of Free Convection (LFC) to the Equilibrium Level (EL): CAPE = integral [ g * ((T_parcel - T_env) / T_env) dz ]. Operational thresholds in India: CAPE below 1000 J/kg indicates weak convective potential; 1000 to 2500 J/kg indicates moderate thunderstorm risk; CAPE exceeding 2500 J/kg with low Convective Inhibition (CIN < 50 J/kg) signifies severe thunderstorm squall and hail risk.',
  },
  {
    documentId: 'plat_imd_thermodynamics',
    documentName: 'IMD Atmospheric Thermodynamics & Upper-Air Sounding Manual',
    pageNumber: 56,
    sectionTitle: 'Section 5.2: Lifting Condensation Level (LCL) Computation',
    content:
      'The Lifting Condensation Level (LCL) represents the height at which an unsaturated surface parcel becomes saturated when lifted dry-adiabatically. An operational approximation for LCL height in meters is z_LCL ~ 125 * (T - T_d), where T is surface air temperature in Celsius and T_d is surface dew point. A low LCL (under 800 m) combined with high low-level moisture and steep lapse rates favors intense severe local convective storm initiation.',
  },

  // 2. NWP Modeling
  {
    documentId: 'plat_imd_nwp',
    documentName: 'IMD Numerical Weather Prediction (NWP) Modeling Framework Manual',
    pageNumber: 22,
    sectionTitle: 'Chapter 2: Governing Hydrodynamic Equations & Discretization',
    content:
      'Numerical Weather Prediction is based on the Navier-Stokes primitive equations governing atmospheric fluids: horizontal momentum equations with Coriolis acceleration, the hydrostatic or non-hydrostatic vertical momentum equation, the continuity equation expressing mass conservation, the thermodynamic energy equation, and conservation equations for water vapor and cloud hydrometeors. Equations are discretized over horizontal spatial grids and sigma-pressure vertical coordinate levels.',
  },
  {
    documentId: 'plat_imd_nwp',
    documentName: 'IMD Numerical Weather Prediction (NWP) Modeling Framework Manual',
    pageNumber: 48,
    sectionTitle: 'Chapter 4: Operational NWP Suites at IMD (NCUM & WRF)',
    content:
      'IMD operates multi-scale numerical suites: 1) NCUM-Global (12 km horizontal resolution) providing deterministic 10-day global synoptic forecasts; 2) NCUM-Regional (4 km resolution) centered over the South Asian monsoon domain; 3) High-resolution Weather Research and Forecasting (WRF at 3 km resolution) for rapid nowcasting and meso-beta scale convective cloud resolution. Boundary conditions are updated every 6 hours using assimilation cycles.',
  },
  {
    documentId: 'plat_imd_nwp',
    documentName: 'IMD Numerical Weather Prediction (NWP) Modeling Framework Manual',
    pageNumber: 65,
    sectionTitle: 'Chapter 5.3: 4D-Var Data Assimilation & Satellite Radiance Ingestion',
    content:
      'Four-Dimensional Variational Data Assimilation (4D-Var) optimizes initial model states by minimizing the cost function comparing background forecasts against observations across a 6-hour assimilation window. Observations assimilated include INSAT-3DR thermal infrared radiances, GPS Radio Occultation refractivity profiles, radiosonde soundings, Doppler weather radar radial velocities, and surface AWS reports.',
  },
  {
    documentId: 'plat_imd_nwp',
    documentName: 'IMD Numerical Weather Prediction (NWP) Modeling Framework Manual',
    pageNumber: 94,
    sectionTitle: 'Chapter 7: Sub-grid Convective Parameterization Schemes',
    content:
      'Processes occurring at scales smaller than model grid spacing (such as cumulus convection, turbulent planetary boundary layer mixing, and microphysical droplet growth) must be parameterized. In models with grid spacing greater than 4 km, mass-flux cumulus schemes (e.g., Kain-Fritsch or Tiedtke) simulate vertical heat and moisture transport. Models operating below 3 km grid spacing explicitly resolve deep convective towers without parameterized cumulus.',
  },

  // 3. Cyclone Forecasting
  {
    documentId: 'plat_imd_cyclone',
    documentName: 'Standard Operating Procedure (SOP) for Tropical Cyclone Warning (RSMC New Delhi)',
    pageNumber: 18,
    sectionTitle: 'Section 3: Classification of Tropical Disturbances in North Indian Ocean',
    content:
      'IMD RSMC New Delhi classifies low-pressure systems based on maximum sustained surface wind speed (3-minute average): Low Pressure Area (< 17 knots, < 31 km/h); Depression (17–27 knots, 31–49 km/h); Deep Depression (28–33 knots, 50–61 km/h); Cyclonic Storm (34–47 knots, 62–88 km/h); Severe Cyclonic Storm (48–63 knots, 89–117 km/h); Very Severe Cyclonic Storm (64–89 knots, 118–166 km/h); Extremely Severe Cyclonic Storm (90–119 knots, 167–221 km/h); Super Cyclonic Storm (>= 120 knots, >= 222 km/h).',
  },
  {
    documentId: 'plat_imd_cyclone',
    documentName: 'Standard Operating Procedure (SOP) for Tropical Cyclone Warning (RSMC New Delhi)',
    pageNumber: 34,
    sectionTitle: 'Section 4.2: Dvorak Satellite Intensity Estimation Technique',
    content:
      'The Dvorak technique is a standardized subjective satellite interpretation method assigning a T-number (T1.0 to T8.0 in 0.5 steps) from visible and infrared imagery patterns. The primary patterns analyzed are: 1) Curved Band Pattern (spiral log arcs wrapping around the circulation center); 2) Central Dense Overcast (CDO); 3) Embedded Center; 4) Eye Pattern (measure of eye temperature vs cold cloud shield). The Data T-number (DT) combined with Model T-number (MET) yields Current Intensity (CI). A CI of 4.0 corresponds to maximum sustained winds of 65 knots (Cat 1 hurricane / VSCS).',
  },
  {
    documentId: 'plat_imd_cyclone',
    documentName: 'Standard Operating Procedure (SOP) for Tropical Cyclone Warning (RSMC New Delhi)',
    pageNumber: 52,
    sectionTitle: 'Section 5.1: 4-Stage Cyclone Warning Protocol & Bulletins',
    content:
      'IMD issues warnings in four designated stages: 1) Pre-Cyclone Watch issued 72 hours prior to landfall during cyclogenesis; 2) Cyclone Alert (Yellow message) issued at least 48 hours prior to expected adverse weather along target coastal districts; 3) Cyclone Warning (Orange message) issued at least 24 hours in advance with track, landfall, and wind forecasts; 4) Post-Landfall Outlook (Red message) issued 12 hours prior to landfall detailing de-escalation, gale winds, and riverine inundation.',
  },

  // 4. AWS and Instrumentation
  {
    documentId: 'plat_imd_aws',
    documentName: 'Surface Meteorological Observation & AWS Network Operations Manual',
    pageNumber: 12,
    sectionTitle: 'Section 2.1: Surface Automatic Weather Station Sensor Architecture',
    content:
      'An IMD Automatic Weather Station (AWS) integrates micro-controller data loggers with precision sensors: 1) Air temperature using a PT100 Platinum Resistance Thermometer enclosed in a multi-plate naturally aspirated radiation shield (accuracy +/- 0.2 deg C); 2) Relative humidity using a capacitive thin-film polymer sensor (accuracy +/- 2%); 3) Atmospheric pressure using a temperature-compensated piezoresistive silicon transducer (accuracy +/- 0.3 hPa); 4) Rainfall using a dual-chamber tipping bucket rain gauge with 0.5 mm or 0.2 mm tip calibration; 5) Wind speed and direction using sonic or 3-cup anemometer and optoelectronic vane.',
  },
  {
    documentId: 'plat_imd_aws',
    documentName: 'Surface Meteorological Observation & AWS Network Operations Manual',
    pageNumber: 29,
    sectionTitle: 'Section 3.4: INSAT-3DR Data Relay Transponder (DRT) Telemetry Protocol',
    content:
      'AWS field stations transmit automated packets at designated hourly slots (e.g. 0300, 0600, 0900, 1200 UTC) over UHF burst uplinks (402.75 MHz) to the INSAT-3DR Data Relay Transponder (DRT). The DRT transponds signals down to Central Receiving Stations (CRS) at IMD Pune and New Delhi. Quality control routines automatically evaluate range tests, step tests, and spatial climatological limits before archiving in the National Data Centre (NDC).',
  },

  // 5. Doppler Radar
  {
    documentId: 'plat_imd_radar',
    documentName: 'Doppler Weather Radar (DWR) Operations & Nowcasting Guidelines',
    pageNumber: 24,
    sectionTitle: 'Chapter 2.2: Doppler Radar Moments & Z-R Precipitation Relationships',
    content:
      'IMD operates S-band and C-band Doppler Weather Radars measuring three primary base moments: Reflectivity Factor (Z in dBZ), Mean Radial Velocity (V in m/s), and Spectrum Width (W). Rainfall rates (R in mm/hr) are estimated through the empirical Marshall-Palmer relationship Z = a * R^b, adapted for Indian tropical monsoons as Z = 200 * R^1.6 for stratiform rain and Z = 300 * R^1.4 for convective thunderstorm cells. Reflectivity values exceeding 45 dBZ indicate heavy downpours; values > 55 dBZ denote severe thunderstorms with potential hail aloft.',
  },
  {
    documentId: 'plat_imd_radar',
    documentName: 'Doppler Weather Radar (DWR) Operations & Nowcasting Guidelines',
    pageNumber: 45,
    sectionTitle: 'Chapter 3.5: Velocity Azimuth Display (VAD) & Low-Level Jets',
    content:
      'The Velocity Azimuth Display (VAD) technique performs harmonic analysis of Doppler radial velocities sampled along a 360-degree azimuthal circle at fixed elevation angles. VAD wind profiles (VWP) provide continuous vertical profiles of horizontal wind speed and direction up to 10 km altitude. Forecasters monitor VWP to track the Low-Level Somali Jet during the monsoon and identify severe vertical wind shear hazardous to civil aviation.',
  },

  // 6. Competencies & WMO Guidelines
  {
    documentId: 'plat_imd_competency',
    documentName: 'IMD Scientific Cadre Competency Standards & Evaluation Framework (WMO-258)',
    pageNumber: 15,
    sectionTitle: 'Competency Area 1: Synoptic Analysis & Prognosis Certification',
    content:
      'Under WMO-258 standards adopted by IMD, Aeronautical Meteorological Forecasters (AMF) and Synoptic Meteorologists must demonstrate verified competency in: 1) Integrating multiple observational streams (AWS, radiosondes, Doppler radar, satellite imagery); 2) Critically evaluating NWP guidance against regional climatology; 3) Formulating consistent synoptic bulletins, SIGMETs, and terminal aerodrome forecasts (TAF); 4) Communicating early warnings with clear uncertainty statements to civil disaster authorities.',
  },
  {
    documentId: 'plat_imd_competency',
    documentName: 'IMD Scientific Cadre Competency Standards & Evaluation Framework (WMO-258)',
    pageNumber: 28,
    sectionTitle: 'Competency Area 3: Meteorological Instrumentation & Calibration',
    content:
      'Scientific Assistants Grade-I and Instrumentation Engineers must maintain certified proficiency in sensor calibration protocols, Stevenson screen siting criteria conforming to WMO Guide No. 8, digital telemetry fault diagnosis, and surface observation coding (SYNOP, METAR, SPECI, and BUFR formats). Competencies are audited bi-annually through objective practical evaluations.',
  },
];

/**
 * Pre-indexes platform knowledge chunks with embeddings
 */
export function getPreIndexedPlatformChunks(): IKnowledgeChunk[] {
  return RAW_PLATFORM_CHUNKS.map((raw, idx) => {
    const chunkId = `plat_chunk_${idx + 1}`;
    const embedding = generateLocalSemanticEmbedding(raw.content);

    return {
      id: chunkId,
      documentId: raw.documentId,
      documentName: raw.documentName,
      pageNumber: raw.pageNumber,
      sectionTitle: raw.sectionTitle,
      uploadedBy: 'system_curriculum_admin',
      documentType: 'platform_handbook',
      uploadDate: '2026-01-01T00:00:00.000Z',
      content: raw.content,
      tokenCount: Math.ceil(raw.content.length / 4),
      embedding,
    };
  });
}
