-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Forms" (
    "formId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER NOT NULL,
    "typRId" INTEGER NOT NULL,

    CONSTRAINT "Forms_pkey" PRIMARY KEY ("formId")
);

-- CreateTable
CREATE TABLE "Response" (
    "responseId" SERIAL NOT NULL,
    "rfor" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("responseId")
);

-- CreateTable
CREATE TABLE "Question" (
    "formId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "correctAnswer" TEXT[],

    CONSTRAINT "Question_pkey" PRIMARY KEY ("formId")
);

-- CreateTable
CREATE TABLE "Answer" (
    "responseId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("responseId","number")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Forms_typRId_key" ON "Forms"("typRId");

-- CreateIndex
CREATE UNIQUE INDEX "Response_rfor_key" ON "Response"("rfor");

-- CreateIndex
CREATE UNIQUE INDEX "Response_ownerId_key" ON "Response"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_number_key" ON "Question"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_number_key" ON "Answer"("number");

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_typRId_fkey" FOREIGN KEY ("typRId") REFERENCES "Response"("responseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_rfor_fkey" FOREIGN KEY ("rfor") REFERENCES "Forms"("formId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("formId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("responseId") ON DELETE RESTRICT ON UPDATE CASCADE;
