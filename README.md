# Usim Safe Paths

# Build SafeTown — USIM Campus Safety Map

Build a clickable website prototype called **SafeTown** for a university hackathon under the *Township of Tomorrow* theme, focusing on **Safety & Security**.

Use React and Leaflet with OpenStreetMap to create a functional, interactive hazard map focused exclusively on Universiti Sains Islam Malaysia (USIM), Nilai campus, Negeri Sembilan, Malaysia.

## 1. Map location and boundaries — IMPORTANT

- Focus the map on the USIM campus in Nilai, Negeri Sembilan, Malaysia.
- Set the initial map centre and zoom level so users can see both the campus padang and the Faculty of Science and Technology (FST) in the same normal map view.
- Widen the initial map coverage slightly compared with a close-up view that stops around the padang. Adjust the map centre, zoom level, or geographic bounds as needed to include FST and the surrounding campus area.
- Use approximately zoom level 15–16 as a starting point, adjusting it to ensure both the padang and FST are visible together.
- Keep the map focused on the USIM campus and its immediate surroundings. Do not show the entire Nilai township as the main map.
- Prevent users from zooming out so far that the map becomes a country-level or state-level view.
- Do not add a custom pin, marker, popup, or special label for FST. FST should appear naturally as part of the regular OpenStreetMap map, using its existing map label if available.
- Verify the map coverage using OpenStreetMap or another reliable map source. Do not guess coordinates or use a different university location.
- Include a visible map heading: "USIM Campus Safety Map".
- Add a small subtitle: "Campus hazard reporting prototype".
- Use realistic campus roads and walkways from OpenStreetMap where available.
- If exact campus boundaries are unavailable, use a reasonable demonstration boundary around the campus. Label it as an approximate prototype boundary, not an official USIM boundary.
- Do not invent real hazards or claim that sample incidents have occurred on campus.

## 2. Interactive hazard map

Use Leaflet with OpenStreetMap tiles and appropriate OpenStreetMap attribution.

Display clearly labelled **fictional demonstration markers** for:
- Broken streetlights
- Damaged pavements
- Blocked walkways
- Flood-prone areas

Place demonstration markers within the approximate campus area. Do not present their coordinates or descriptions as verified real-world incidents.

Use distinct marker colours or icons for each hazard category.

When a user clicks a marker, open a popup displaying:
- Hazard title
- Hazard category
- Description
- Date reported
- Current status: Pending, Verified, or Resolved
- A clear "Demonstration Data" label for fictional sample reports

## 3. Filters

Add working filters for:
- Hazard category
- Report status

When filters change, update both the map markers and the recent reports list.

Include an option to show all reports.

Ensure filtering works correctly after reports are added or their statuses are changed.

## 4. Report a Hazard form

Add a prominent "Report a Hazard" button.

When clicked, open a modal or side panel containing:
- Hazard category dropdown
- Description field
- Location selection, preferably by clicking the map or entering a location description
- Optional photo upload with an image preview
- Submit and Cancel buttons

Validate required fields.

When the user submits the form:
- Add the new report to the map and recent reports list using React local state only.
- Give the new report a Pending status.
- Display a success message.
- Allow the user to open the new marker and view its details.

Do not upload photos to a server. Keep uploaded image previews in browser memory for the prototype.

## 5. Status updates

Allow users to change the status of existing reports using a dropdown or button on each report card.

Available statuses:
- Pending
- Verified
- Resolved

Requirements:
- Allow status changes for both fictional sample reports and newly submitted reports.
- Update the report's status immediately when a new status is selected.
- Keep the status consistent across the report card, map popup, filters, and dashboard counts.
- Ensure a report moved to a different status appears correctly when the corresponding status filter is selected.
- Keep the report's title, description, category, date, and location unchanged when its status is updated.
- Use React local state only. No backend or database is required.
- Status changes only need to last during the current browser session and may reset when the page is refreshed.
- Keep the existing design and features unchanged.

## 6. Recent reports panel

Create a panel beside the map on desktop and below or above the map on mobile.

Each report card should display:
- Hazard category and title
- Short description
- Report date
- Status badge
- Location information
- A status dropdown or button to update the report status

Clicking a report card should focus the map on the corresponding marker and open its popup.

Changing the status on a report card should update the corresponding map popup and dashboard counts immediately.

Use fictional sample reports only, clearly labelled as demonstration data.

## 7. Dashboard summary

Above the map, display small summary cards showing:
- Total demonstration reports
- Pending reports
- Verified reports
- Resolved reports

Requirements:
- Calculate counts from the current report data rather than hardcoding them.
- Update counts whenever a new report is submitted or an existing report's status changes.
- Calculate summary counts from all reports, regardless of active filters, so the dashboard always shows the overall totals.
- Clearly distinguish demonstration data from real incident statistics.

## 8. Design

Create a clean, modern, professional interface suitable for a university hackathon presentation.

Colour palette:
- Navy blue for the header and main text
- Forest green for primary action buttons
- White and light grey for backgrounds
- Amber for Pending status
- Blue for Verified status
- Green for Resolved status

Use readable typography, rounded cards, subtle shadows, clear icons, and adequate spacing.

The map must be the main visual feature.

Make the interface responsive on desktop, tablet, and mobile devices. Ensure the map has a defined height and remains usable on smaller screens.

## 9. Technology and limitations

- React for the interface.
- Leaflet and React-Leaflet for the interactive map.
- OpenStreetMap tiles with proper attribution.
- React local state for reports, filters, status changes, and interactions.
- No backend, database, authentication, payment system, or server-side image upload.
- No external emergency dispatch or live incident reporting integrations.
- Do not claim that reports are permanently saved or shared between users.
- Explain that refreshing the page may reset new reports and status changes.

## 10. Functional requirements

This must be a working clickable prototype, not just a static visual mockup.

Test that:

1. The map opens focused on USIM's Nilai campus.
2. The initial view includes both the padang and FST, without a custom FST marker or popup.
3. The map shows the correct campus roads and surrounding features where OpenStreetMap data is available.
4. Hazard markers display the correct report details.
5. Category and status filters work.
6. Clicking a report card focuses the map on its marker and opens the popup.
7. Submitting a report adds a new marker and report card.
8. Existing reports, including fictional sample reports, can have their status changed between Pending, Verified, and Resolved.
9. Status changes are reflected consistently in report cards, map popups, filters, and dashboard counts.
10. Dashboard counts update correctly when reports are added or their statuses change.
11. The layout works on desktop, tablet, and mobile.
12. OpenStreetMap attribution is visible.
13. All fictional reports are clearly labelled as demonstration data.
14. All visible buttons, filters, dropdowns, and form controls perform their intended actions.

Keep the implementation simple and reliable. Prioritise the campus-focused map and working interactions over unnecessary features.

After building the website, provide a brief explanation of the implemented features and how to test the map, report submission, filters, and status updates. Do not add features outside this scope.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://usim-safe-paths.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bafc3362-c8f6-40f7-b9ce-2acdd53b7f35).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
