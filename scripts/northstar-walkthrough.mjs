// Preview-only navigation over the fictional commercial example, never a product-state simulator.
export const walkthroughNavigation = `<nav class="northstar-walkthrough" aria-label="Fictional Northstar example walkthrough">
  <p class="northstar-walkthrough-label">Explore the fictional example <span>All four steps are shown below</span></p>
  <ol>
    <li><a href="#northstar-direction"><span aria-hidden="true">01</span> Read the evidence</a></li>
    <li><a href="#northstar-acceptance"><span aria-hidden="true">02</span> Make the decision</a></li>
    <li><a href="#northstar-coordinate"><span aria-hidden="true">03</span> Accept the work</a></li>
    <li><a href="#northstar-learning"><span aria-hidden="true">04</span> Check again</a></li>
  </ol>
</nav>`;

export function addNorthstarWalkthrough(page) {
  const start = page.indexOf('<section class="section ledger-section launch-comparison"');
  const end = page.indexOf('</section>', start);
  if (start < 0 || end < 0) throw Error('Northstar example section missing');
  let section = page.slice(start, end);
  const replace = (from, to) => {
    if (section.split(from).length !== 2) throw Error(`Expected one Northstar target: ${from}`);
    section = section.replace(from, to);
  };
  replace('<p class="scenario-trigger">', `${walkthroughNavigation}\n        <p class="scenario-trigger northstar-stage" id="northstar-direction" tabindex="-1">`);
  replace('<article class="launch-comparison-panel">', '<article class="launch-comparison-panel northstar-stage" id="northstar-acceptance" tabindex="-1" aria-label="Make the decision in the fictional example">');
  replace('<article class="launch-comparison-panel proposed-panel">', '<article class="launch-comparison-panel proposed-panel northstar-stage" id="northstar-coordinate" tabindex="-1" aria-label="Accept the work in the fictional example">');
  replace('<div class="launch-state" aria-label="Illustrative Northstar learning review">', '<div class="launch-state northstar-stage" id="northstar-learning" tabindex="-1" aria-label="Illustrative Northstar learning review">');
  return page.slice(0, start) + section + page.slice(end);
}
