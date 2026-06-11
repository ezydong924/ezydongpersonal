/** Base URL for media files.
 *  Currently served locally from /public/. After R2 migration:
 *  - Replace with "https://<your-r2-bucket>.r2.dev"
 *  - Upload all files in public/music/ and public/*.mp4 to the bucket
 *  - Delete local media files from git
 */
export const MEDIA_BASE = ""; // "" = local /public/ — change to R2 URL after bucket creation
