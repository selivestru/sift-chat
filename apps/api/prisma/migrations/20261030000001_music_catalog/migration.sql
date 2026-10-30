-- CreateEnum
CREATE TYPE "ReleaseType" AS ENUM ('SINGLE', 'EP', 'ALBUM');

-- CreateEnum
CREATE TYPE "ArtistMemberRole" AS ENUM ('OWNER', 'MANAGER');

-- CreateEnum
CREATE TYPE "ReleaseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "TrackArtistRole" AS ENUM ('PRIMARY', 'FEATURED');

-- CreateEnum
CREATE TYPE "AudioAssetKind" AS ENUM ('SOURCE', 'HLS_PACKAGE');

-- CreateEnum
CREATE TYPE "AudioAssetStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "artists" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_members" (
    "artistId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "ArtistMemberRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artist_members_pkey" PRIMARY KEY ("artistId","userId")
);

-- CreateTable
CREATE TABLE "releases" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "type" "ReleaseType" NOT NULL,
    "status" "ReleaseStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "ownerArtistId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "release_artists" (
    "releaseId" UUID NOT NULL,
    "artistId" UUID NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "release_artists_pkey" PRIMARY KEY ("releaseId","artistId")
);

-- CreateTable
CREATE TABLE "recordings" (
    "id" UUID NOT NULL,
    "ownerArtistId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "durationMs" INTEGER,
    "explicit" BOOLEAN,
    "playCount" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recordings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" UUID NOT NULL,
    "releaseId" UUID NOT NULL,
    "recordingId" UUID NOT NULL,
    "discNumber" INTEGER NOT NULL DEFAULT 1,
    "trackNumber" INTEGER NOT NULL,
    "playCount" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_artists" (
    "trackId" UUID NOT NULL,
    "artistId" UUID NOT NULL,
    "role" "TrackArtistRole" NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "track_artists_pkey" PRIMARY KEY ("trackId","artistId")
);

-- CreateTable
CREATE TABLE "audio_assets" (
    "id" UUID NOT NULL,
    "recordingId" UUID NOT NULL,
    "kind" "AudioAssetKind" NOT NULL,
    "status" "AudioAssetStatus" NOT NULL DEFAULT 'PENDING',
    "storageKey" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audio_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "artist_members_userId_idx" ON "artist_members"("userId");

-- CreateIndex
CREATE INDEX "releases_ownerArtistId_idx" ON "releases"("ownerArtistId");

-- CreateIndex
CREATE INDEX "releases_createdById_idx" ON "releases"("createdById");

-- CreateIndex
CREATE INDEX "release_artists_artistId_idx" ON "release_artists"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "release_artists_releaseId_position_key" ON "release_artists"("releaseId", "position");

-- CreateIndex
CREATE INDEX "recordings_ownerArtistId_idx" ON "recordings"("ownerArtistId");

-- CreateIndex
CREATE INDEX "tracks_recordingId_idx" ON "tracks"("recordingId");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_releaseId_discNumber_trackNumber_key" ON "tracks"("releaseId", "discNumber", "trackNumber");

-- CreateIndex
CREATE INDEX "track_artists_artistId_idx" ON "track_artists"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "track_artists_trackId_position_key" ON "track_artists"("trackId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "audio_assets_storageKey_key" ON "audio_assets"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "audio_assets_recordingId_kind_key" ON "audio_assets"("recordingId", "kind");

-- AddForeignKey
ALTER TABLE "artist_members" ADD CONSTRAINT "artist_members_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_members" ADD CONSTRAINT "artist_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "releases" ADD CONSTRAINT "releases_ownerArtistId_fkey" FOREIGN KEY ("ownerArtistId") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "releases" ADD CONSTRAINT "releases_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "release_artists" ADD CONSTRAINT "release_artists_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "releases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "release_artists" ADD CONSTRAINT "release_artists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_ownerArtistId_fkey" FOREIGN KEY ("ownerArtistId") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "releases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "recordings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audio_assets" ADD CONSTRAINT "audio_assets_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "recordings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Numeric invariants (duration may be unknown while a recording is a draft).
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_durationMs_positive" CHECK ("durationMs" IS NULL OR "durationMs" > 0);
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_playCount_nonnegative" CHECK ("playCount" >= 0);
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_discNumber_positive" CHECK ("discNumber" > 0);
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_trackNumber_positive" CHECK ("trackNumber" > 0);
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_playCount_nonnegative" CHECK ("playCount" >= 0);
ALTER TABLE "release_artists" ADD CONSTRAINT "release_artists_position_positive" CHECK ("position" > 0);
ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_position_positive" CHECK ("position" > 0);
