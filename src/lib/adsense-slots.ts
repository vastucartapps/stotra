/**
 * Google AdSense Slot Configuration
 * These are unique ad slot IDs for different page locations
 * Update these with your actual AdSense slot IDs from your AdSense account
 */

export const AD_SLOTS = {
  // Homepage ads
  homepage_top: '1234567890', // Top of homepage
  homepage_middle: '1234567891', // Middle section
  homepage_bottom: '1234567892', // Bottom section

  // Stotra detail page ads
  stotraDetail_top: '1234567893', // Top of stotra content
  stotraDetail_middle: '1234567894', // Middle of stotra
  stotraDetail_bottom: '1234567895', // Bottom of stotra

  // Gita chapter page ads
  gitaChapter_top: '1234567896', // Top of Gita chapter
  gitaChapter_bottom: '1234567897', // Bottom of Gita chapter

  // Deity page ads
  deityPage_middle: '1234567898', // Middle of deity page

  // Today's stotras page ads
  todayPage_middle: '1234567899', // Middle of today's stotras
};

/**
 * Helper function to get the correct slot ID for a page
 * @param pageType - The type of page
 * @param position - Position on the page (top, middle, bottom)
 * @returns The slot ID for that page/position
 */
export function getAdSlotId(
  pageType: 'homepage' | 'stotra' | 'gita' | 'deity' | 'today',
  position: 'top' | 'middle' | 'bottom' = 'middle'
): string {
  const key = `${pageType}_${position}` as keyof typeof AD_SLOTS;
  return AD_SLOTS[key] || AD_SLOTS.homepage_middle;
}
