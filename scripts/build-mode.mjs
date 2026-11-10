// Production promotion is deliberate and limited to the verified hosting path.
// An ordinary local/branch build stays archival. Existing study commands remain
// available for comparison without silently turning them into a release.
export function isReleaseReview(env = process.env) {
  const branch = 'codex/solar-bridge-study';
  return (env.NETLIFY === 'true' && env.CONTEXT === 'deploy-preview' && env.HEAD === branch)
    || (env.VERCEL === '1' && env.VERCEL_ENV === 'preview' && env.VERCEL_GIT_COMMIT_REF === branch);
}
export function buildMode(env = process.env) {
  const hosted = Boolean(env.NETLIFY || env.VERCEL);
  const review = isReleaseReview(env);
  const production = env.VERCEL === '1' && env.VERCEL_ENV === 'production' && env.VERCEL_GIT_COMMIT_REF === 'main';
  if (env.COORDINATED_RELEASE && (env.COORDINATED_RELEASE !== 'local' || hosted)) {
    throw Error('COORDINATED_RELEASE=local is for unhosted verification only. Hosted releases require the approved environment and branch.');
  }
  if (production || review || env.COORDINATED_RELEASE === 'local') return 'release';
  if (env.WIDE_LAUNCH_PREVIEW === 'local' && !hosted) return 'study';
  return 'legacy';
}
