import { isBrowser } from ".";
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

export function printElement(elementId: string) {
  if (isBrowser) {
    var mywindow = window.open('', 'PRINT', 'height=600,width=800');
    var element = document.getElementById(elementId);


    if (mywindow && element) {
      mywindow.document.write('<html><head><title>' + document.title + '</title>');
      mywindow.document.write('</head><body >');
      mywindow.document.write(element.innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
    }

    return true;
  }
}

export function downloadElement(elementId: string, imageName: string) {
  if (isBrowser) {
    var element = document.getElementById(elementId);

    if (element) {
      htmlToImage.toPng(element)
        .then(function (dataUrl) {
          download(dataUrl, imageName + '.png');
        })
        .catch(function (error) {
          console.error('Error downloading image!', error);
        });
    }

    return true;
  }
}