/**
 * Google AdSense Slot Configuration
 * 
 * HOW TO GET YOUR SLOT IDS:
 * 1. Go to https://adsense.google.com
 * 2. Click "Ads" → "By placement" in the left menu
 * 3. Look for your ad units (you can create new ones if needed)
 * 4. Copy the number after "pub-" for each ad unit
 * 
 * EXAMPLE:
 * If your ad unit shows: ca-pub-1411902986257886/1234567890
 * Then your slot ID is: 1234567890
 * 
 * Replace the placeholder values below with your actual slot IDs
 */

export const AD_SLOTS = {
  // Homepage ads - Create these in Google AdSense
  homepage_top: '1234567890',      // Top of homepage (728x90 leaderboard)
  homepage_middle: '1234567891',   // Middle section (300x250 rectangle)
  homepage_bottom: '1234567892',   // Bottom section (728x90 leaderboard)

  // Stotra detail page ads
  stotraDetail_top: '1234567893',    // Top of stotra content (300x250)
  stotraDetail_middle: '1234567894', // Middle of stotra (728x90)
  stotraDetail_bottom: '1234567895', // Bottom of stotra (300x250)

  // Gita chapter page ads
  gitaChapter_top: '1234567896',     // Top of Gita chapter (300x250)
  gitaChapter_bottom: '1234567897',  // Bottom of Gita chapter (300x250)

  // Deity page ads
  deityPage_middle: '1234567898',    // Middle of deity page (728x90)

  // Today's stotras page ads
  todayPage_middle: '1234567899',    // Middle of today's stotras (300x250)

  // Vrat Katha page ads
  vratKatha_middle: '1234567900',    // Middle of vrat katha (300x250)
};

/**
 * Helper function to get the correct slot ID for a page
 * @param pageType - The type of page
 * @param position - Position on the page (top, middle, bottom)
 * @returns The slot ID for that page/position
 * 
 * USAGE EXAMPLE:
 * const slotId = getAdSlotId('stotra', 'middle');
 * <AdSenseSlot slotId={slotId} />
 */
export function getAdSlotId(
  pageType: 'homepage' | 'stotra' | 'gita' | 'deity' | 'today' | 'vrat',
  position: 'top' | 'middle' | 'bottom' = 'middle'
): string {
  // Convert page type to match AD_SLOTS keys
  let key = `${pageType}`;
  
  if (pageType === 'stotra') key = 'stotraDetail';
  else if (pageType === 'gita') key = 'gitaChapter';
  else if (pageType === 'today') key = 'todayPage';
  else if (pageType === 'deity') key = 'deityPage';
  else if (pageType === 'vrat') key = 'vratKatha';
  
  const fullKey = `${key}_${position}` as keyof typeof AD_SLOTS;
  return AD_SLOTS[fullKey] || AD_SLOTS.homepage_middle;
}
