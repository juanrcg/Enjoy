import React, { useState,useEffect,useContext } from 'react';
import { useWebSocket } from '../../Context/WebSocketContext';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from "@aws-sdk/lib-storage";
import AccountContext from '../../Context/AccountContext';

function Bar() {
  const { getSession } = useContext(AccountContext);
  const { socket, receivedProducts } = useWebSocket();
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]); // Updated to handle multiple files
  const [previews, setPreviews] = useState([]); // Previews for files
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontColor, setFontColor] = useState('#000000');
  const [fontStyle, setFontStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductSelector, setShowProductSelector] = useState(false);
  let author = '';
  let ownername = '';

  getSession()
  .then(session => {

    author = session.sub;
    ownername =session.name
      
  })
  .catch(err => {

      console.log(err);
  })

useEffect(() => {
    // This code will run whenever `receivedProducts` is updated
    console.log('Received products updated:', receivedProducts);

    // You can add any other logic you want to execute when `receivedProducts` changes
    // For example, performing some actions like filtering, logging, or updating other states
    
    // Example: If you want to do something with each new product:
    receivedProducts.forEach((product) => {
        console.log(`Product added: ${product.name}`);
    });

}, [receivedProducts]); // This will run every time `receivedProducts` is updated


  // Use your AWS credentials (not recommended for frontend use)
  const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

  const uploadFile = async (file) => {
    try {
        const blob = file.fileObject; // fileObject is the actual File object
        const params = {
          Bucket: 'hangoutdata',
          Key: `post/admin/${file.name}`, // Customize the path as needed
          Body: blob,
          ContentType: file.type,
        };

        // Use the Upload utility for handling large files efficiently
        const uploader = new Upload({
          client: s3Client,
          params: params,
        });

        // Optional: Monitor the upload progress
        uploader.on("httpUploadProgress", (progress) => {
            console.log(`Uploaded ${progress.loaded} of ${progress.total} bytes`);
          });

        // Execute the upload and wait for completion
        const response = await uploader.done();
        console.log("Upload successful:", response);

        return response; // Return response details, e.g., ETag
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw error; // Propagate the error for further handling
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) {
      console.error('No files selected');
      return;
    }

    const readFiles = selectedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // For preview: Read file as base64
        reader.onload = () => {
          resolve({ 
            name: file.name, 
            type: file.type, 
            data: reader.result,  // base64 for preview
            fileObject: file      // Keep original file object for upload
          });
        };
        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file); // Read file as base64 for previews
      });
    });

    Promise.all(readFiles)
      .then((fileData) => {
        setFiles((prevFiles) => [...prevFiles, ...fileData]); // Append new files with original file objects
        const previews = fileData.map((file) => file.data);  // Get base64 for preview
        setPreviews((prevPreviews) => [...prevPreviews, ...previews]); // Append new previews
      })
      .catch((error) => console.error('File reading failed', error));
  };

  const handleRemovePreview = (index) => {
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleFileUpload = () => {
    document.getElementById('file-upload').click();
  };

  const handleFontStyleChange = (style) => {
    setFontStyle((prevState) => ({
      ...prevState,
      [style]: !prevState[style],
    }));
  };

  const handleProductSelect = (e) => {
    const productId = parseInt(e.target.value, 10);
    const product = receivedProducts.find((p) => p.id == productId);
    setSelectedProduct(product);
    console.log(product.name);
  };

  const handleSubmit = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const body = {
        action: 'addpost',
        content: content,
        fontFamily,
        fontStyle: JSON.stringify(fontStyle),
        fontColor,
        selectedProduct: JSON.stringify({
          name: selectedProduct.name,
          price: selectedProduct.price,
          description: selectedProduct.description,
          id:selectedProduct.id,
        }),
        author,
        ownername,
        files: JSON.stringify(files.map(file => `https://hangoutdata.s3.us-east-1.amazonaws.com/post/admin/${file.name}`)), // Only send file metadata, not content
      };
  
      console.log('Sending WebSocket message:', body);
      socket.send(JSON.stringify(body));
      handleFileSubmit();
    } else {
      console.error('WebSocket is not open.');
    }
  };
  

  const handleFileSubmit = async () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Loop through each file in the files array
      for (const file of files) {
        uploadFile(file);
      }
    } else {
      console.error('WebSocket is not open.');
    }
  };

  return (<div className="bar-container p-3 mb-4 border rounded shadow-sm">
  <div className="d-flex flex-column align-items-start w-100">
    {/* Textarea for user input */}
    <div className="mb-3 w-100">
      <textarea
        className="form-control"
        rows="2"
        placeholder="What are you thinking?"
        value={content}
        onChange={handleContentChange}
        style={{
          fontFamily: fontFamily,
          color: fontColor,
          fontWeight: fontStyle.bold ? 'bold' : 'normal',
          fontStyle: fontStyle.italic ? 'italic' : 'normal',
          textDecoration: fontStyle.underline ? 'underline' : 'none',
        }}
      />
    </div>

    {/* Compact Toolbar */}
    <div
      className="d-flex align-items-center w-100"
      style={{ gap: '5px', flexWrap: 'nowrap', overflowX: 'auto' }}
    >
      {/* Styling buttons */}
      <button
        className={`btn ${fontStyle.bold ? 'btn-dark' : 'btn-outline-dark'}`}
        onClick={() => handleFontStyleChange('bold')}
        style={{ padding: '5px 8px' }}
      >
        B
      </button>
      <button
        className={`btn ${fontStyle.italic ? 'btn-dark' : 'btn-outline-dark'}`}
        onClick={() => handleFontStyleChange('italic')}
        style={{ padding: '5px 8px' }}
      >
        I
      </button>
      <button
        className={`btn ${fontStyle.underline ? 'btn-dark' : 'btn-outline-dark'}`}
        onClick={() => handleFontStyleChange('underline')}
        style={{ padding: '5px 8px' }}
      >
        U
      </button>

      {/* Font family dropdown */}
      <select
        className="form-select"
        value={fontFamily}
        onChange={(e) => setFontFamily(e.target.value)}
        style={{
          width: '120px',
          padding: '5px',
          fontSize: '0.85rem',
          flexShrink: 0,
        }}
      >
        <option value="Arial">Arial</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Verdana">Verdana</option>
      </select>

      {/* Font color */}
      <input
        type="color"
        className="form-control form-control-color"
        value={fontColor}
        onChange={(e) => setFontColor(e.target.value)}
        title="Choose text color"
        style={{
          width: '30px',
          height: '30px',
          padding: '0',
          border: '1px solid #ccc',
        }}
      />

      {/* Add Image or Video */}
      <button
        className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
        onClick={handleFileUpload}
        style={{ width: '30px', height: '30px', padding: '5px' }}
      >
        <i className="fas fa-image"></i>
      </button>
      <input
        type="file"
        className="d-none"
        id="file-upload"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
      />

      {/* Select Product */}
      <button
        className="btn btn-outline-primary d-flex align-items-center justify-content-center"
        onClick={() => setShowProductSelector(!showProductSelector)}
        style={{ width: '30px', height: '30px', padding: '5px' }}
      >
        <i className="fas fa-dollar-sign"></i>
      </button>

      {/* Post Button - Positioned beside dollar sign button */}
      <button
        className="btn btn-primary ms-auto"
        onClick={handleSubmit}
        style={{ padding: '5px 10px' }}
      >
        Post
      </button>
    </div>
  </div>

  {/* Previews */}
  {previews.length > 0 && (
    <div className="mt-3">
      <h6>Previews:</h6>
      <div className="d-flex flex-wrap">
        {previews.map((preview, index) => (
          <div key={index} className="position-relative me-2 mb-2">
            <img
              src={preview}
              alt={`File preview ${index + 1}`}
              className="me-2 mb-2"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            {/* "X" Button for removing preview */}
            <button
              className="btn btn-sm btn-danger position-absolute top-0 end-0"
              style={{
                width: '20px',
                height: '20px',
                padding: '0',
                fontSize: '12px',
                borderRadius: '50%',
                backgroundColor: 'red',
                color: 'white',
              }}
              onClick={() => handleRemovePreview(index)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Product Selector */}
  {showProductSelector && (
    <div className="mt-4 w-100">
      <h5>Select a Product</h5>
      <select
        className="form-select mb-3"
        onChange={handleProductSelect}
        defaultValue=""
      >
        <option value="" disabled>
          Choose a product
        </option>
        {receivedProducts.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} - {product.price}
          </option>
        ))}
      </select>

      {selectedProduct && (
        <div>
          <h6>Selected Product:</h6>
          <p>Name: {selectedProduct.name}</p>
          <p>Price: {selectedProduct.price}</p>
          <p>Description: {selectedProduct.description}</p>
        </div>
      )}
    </div>
  )}
</div>



  );
}

export default Bar;
