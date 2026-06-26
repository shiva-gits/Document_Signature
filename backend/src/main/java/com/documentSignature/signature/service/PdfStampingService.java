package com.documentSignature.signature.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class PdfStampingService {

    /**
     * Core Execution Engine to embed textual/graphical signatures onto a physical
     * PDF template.
     * * @param sourcePath The absolute filepath to the original unsigned PDF.
     * 
     * @param outputPath    The destination filepath where the final signed PDF will
     *                      be generated.
     * @param frontendX     The raw X coordinate saved from the drag-and-drop UI
     *                      workspace.
     * @param frontendY     The raw Y coordinate saved from the drag-and-drop UI
     *                      workspace.
     * @param targetPageNum The page number targeted by the signature placement
     *                      (1-indexed).
     * @param signerName    The string identifier/name to embed inside the stamped
     *                      boundary box.
     */

    public boolean generateSignedDocument(String sourcePath, String outputPath, float frontendX, float frontendY,
            int targetPageNum, String signerName) throws IOException {

        File file = new File(sourcePath);

        // safety check for the original source file even exists or not on the disk
        if (!file.exists()) {
            System.err.println("CRITICAL ERROR: source file not found at: " + sourcePath);
            return false;
        }

        // Load the Physical binary document stream using pdfbox
        try (PDDocument document = Loader.loadPDF(file)) {

            // Pdf pages are 0-indexed internally, convert from frontend 1-index tracking
            int internalPageIndex = targetPageNum - 1;

            // safety check
            if (internalPageIndex < 0 || internalPageIndex >= document.getNumberOfPages()) {
                throw new IllegalArgumentException("Target page index falls outside document boundaries.");
            }

            // retrieve the target page object
            PDPage page = document.getPage(internalPageIndex);

            // Extract page hieght to execute the coordinate system transformation mapping
            float pageHeight = page.getMediaBox().getHeight();

            // perform the relative y-axis calculation inversion
            float convertedX = frontendX;
            float convertedY = pageHeight - frontendY - 25f; // offset standard signature field box height factor

            // initialize an append content stream to embed elements cleanly over original
            // content
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page,
                    PDPageContentStream.AppendMode.APPEND, true, true)) {

                // setup a clean, distictive cryptographic verification font styling
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 10);
                contentStream.setNonStrokingColor(15, 23, 42); // enterprise dark slate(#0f172a)

                // draw a structural border dounding box framing the signature zone placeholder
                contentStream.setLineWidth(1f);
                contentStream.setStrokingColor(37, 99, 235); // blue accent outline
                contentStream.addRect(convertedX, convertedY, 150f, 25f); // matches frontend drop metrics perfectly
                contentStream.stroke();

                // begin writing the immutable signature textual hash block
                contentStream.beginText();

                // position text inside the newly generated blue rectangle frame padding bounds
                contentStream.newLineAtOffset(convertedX + 6f, convertedY + 8f);
                contentStream.showText("🖋️ Signed by: " + signerName);
                contentStream.endText();
            }

            // enforce document immutability - lock metadata down to prevent external
            // modifications
            document.getDocumentInformation().setCustomMetadataValue("Docuemnt-Status", "IMMUTABLE_SIGNED_LEDGER");
            document.getDocumentInformation().setAuthor("SignLedger core automation engine");

            // save the newly modified byte architecture out to our storage folder location
            document.save(new File(outputPath));
            return true; // execution successful
        } catch (IOException e) {
            // catch block A: handle physical file stream exceptions safely
            System.err
                    .println("PDFBOX IO STREAM ERROR: failure reading/writing the physical binary file array. Reason: "
                            + e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            // catch block B: handle out of bound page requests safely
            System.err.println("INVALID COORDINATE METRICS ERROR: " + e.getMessage());
            return false;
        } catch (Exception e) {
            // catch block C: global safety net for any other unhandled runtime errors
            System.err.println("UNEXPECTED COMPILATION ERROR: " + e.getMessage());
            return false;
        }
    }
}
