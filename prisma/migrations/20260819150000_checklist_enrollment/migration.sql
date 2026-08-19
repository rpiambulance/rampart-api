-- Working through a checklist becomes a decision rather than something that
-- applies to everyone pursuing a credential.
CREATE TABLE "ChecklistEnrollment" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "startedById" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChecklistEnrollment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ChecklistEnrollment_templateId_memberId_key" ON "ChecklistEnrollment"("templateId", "memberId");
CREATE INDEX "ChecklistEnrollment_memberId_idx" ON "ChecklistEnrollment"("memberId");

ALTER TABLE "ChecklistEnrollment" ADD CONSTRAINT "ChecklistEnrollment_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EvalFormTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChecklistEnrollment" ADD CONSTRAINT "ChecklistEnrollment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChecklistEnrollment" ADD CONSTRAINT "ChecklistEnrollment_startedById_fkey" FOREIGN KEY ("startedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Anyone with a sign-off already has evidently started: enrol them so work in
-- progress does not vanish from their list.
INSERT INTO "ChecklistEnrollment" ("templateId", "memberId", "startedAt")
SELECT DISTINCT i."templateId", s."memberId", MIN(s."signedAt")
FROM "ChecklistSignoff" s
JOIN "EvalFormItem" i ON i.id = s."itemId"
GROUP BY i."templateId", s."memberId"
ON CONFLICT DO NOTHING;
