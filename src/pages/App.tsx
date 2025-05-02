import React, { useState, useEffect } from 'react';
import {
  Product,
  Employee,
  PaymentMethod,
} from '../types/productAndCustomer.types';

const App: React.FC = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [productBarcode, setProductBarcode] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [salesPerson, setSalesPerson] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [vatAmount, setVatAmount] = useState('');
  const [customerName, setCustomerName] = useState('N/A');
  const [customerMembership, setCustomerMembership] = useState('Not Found');
  const [customerDiscount, setCustomerDiscount] = useState('Not found');
  const [products, setProducts] = useState<Product[]>([]);
  const [mrp, setMrp] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [totalItemsQuantity, setTotalItemsQuantity] = useState(0);
  const [totalPayableAmount, setTotalPayableAmount] = useState(0);
  const [paymentMethod1, setPaymentMethod1] = useState('');
  const [paymentAmount1, setPaymentAmount1] = useState(0);
  const [paymentMethod2, setPaymentMethod2] = useState('');
  const [paymentAmount2, setPaymentAmount2] = useState(0);
  const [payableAmountAddition, setPayableAmountAddition] = useState(0);
  const [totalReceivedAmount, setTotalReceivedAmount] = useState(0);
  const [change, setChange] = useState(0);
  const [salesPeopleOptions, setSalesPeopleOptions] = useState<Employee[]>([]);
  const [paymentMethodsOptions, setPaymentMethodsOptions] = useState<PaymentMethod[]>([]);
  const [loadingSalesPeople, setLoadingSalesPeople] = useState(true);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);
  const [loadingProductSearch, setLoadingProductSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6IkthbXJ1bCIsImVtYWlsIjoiaGVhZG9mZmljZUBnbWFpbC5jb20iLCJhZGRyZXNzIjpudWxsLCJwaG9uZSI6IjAxOTQ1NTE4OTgiLCJyb2xlIjoiTUFOQUdFUiIsImF2YXRhciI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2Ryb3lqaXF3Zi9pbWFnZS91cGxvYWQvdjE2OTY4MDE4MjcvZG93bmxvYWRfZDZzOGJpLmpwZyIsImJyYW5jaCI6MywiYnJhbmNoSW5mbyI6eyJpZCI6MywiYnJhbmNoTmFtZSI6IkhlYWQgT2ZmaWNlIiwiYnJhbmNoTG9jYXRpb24iOiJCYXNodW5kaGFyYSIsImR1ZSI6MCwiYWRkcmVzcyI6IkJhc2h1bmRoYXJhIGNpdHkiLCJwaG9uZSI6IjAxOTQ1NTUxODkyOCIsImhvdGxpbmUiOiIwMTk0NTM2MzU1MiIsImVtYWlsIjoiaGVhZG9mZmljZUBnbWFpbC5jb20iLCJvcGVuSG91cnMiOm51bGwsImNsb3NpbmdIb3VycyI6bnVsbCwiaXNBZGp1c3RtZW50Ijp0cnVlLCJ0eXBlIjoiSGVhZE9mZmljZSJ9LCJpYXQiOjE3NDYwNDE0NzUsImV4cCI6MTc0NzMzNzQ3NX0.PUQfy4Vc2OorR6Yc9JO6lePwiXi20q0MppcIDxGtbsk";



  useEffect(() => {
    const fetchSalesPeople = async () => {
      try {
        const response = await fetch(
          'https://front-end-task-lake.vercel.app/api/v1/employee/get-employee-all',
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch sales people: ${response.status}`);
        }
        const data = await response.json();
        setSalesPeopleOptions(data.data);
        setLoadingSalesPeople(false);
      } catch (error: any) {
        setError(error.message);
        setLoadingSalesPeople(false);
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(
          'https://front-end-task-lake.vercel.app/api/v1/account/get-accounts?type=All',
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch payment methods: ${response.status}`);
        }
        const data = await response.json();
        setPaymentMethodsOptions(data.data);
        setLoadingPaymentMethods(false);
      } catch (error: any) {
        setError(error.message);
        setLoadingPaymentMethods(false);
      }
    };

    fetchSalesPeople();
    fetchPaymentMethods();
  }, []);

  const fetchProductBySku = async (sku: string) => {
    setLoadingProductSearch(true);
    try {
      const response = await fetch(
        `https://front-end-task-lake.vercel.app/api/v1/purchase/get-purchasesingle?search=${sku}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch product with SKU ${sku}: ${response.status}`);
      }
      const data = await response.json();
      if (data.data) {
        const newProduct: Product = {
          name: data.data.product.productName,
          size: data.data.size || 'N/A',
          color: data.data.color || 'N/A',
          availableStock: data.data.quantity.toString() + ' Units',
          sku: data.data.sku,
          price: data.data.sellingPrice,
          quantity: 1,
          subtotal: data.data.sellingPrice,
        };
        setProducts([newProduct]); // Replace existing static products
        calculateTotals([newProduct]);
      } else {
        setError(`Product with SKU ${sku} not found.`);
        setProducts([]);
        calculateTotals([]);
      }
    } catch (error: any) {
      setError(error.message);
      setProducts([]);
      calculateTotals([]);
    } finally {
      setLoadingProductSearch(false);
      setProductBarcode(''); // Clear the barcode input after search
    }
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductBarcode(e.target.value);
  };

  const handleBarcodeSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && productBarcode) {
      fetchProductBySku(productBarcode);
    }
  };

  const handleProductQuantityChange = (index: number, newQuantity: number) => {
    const updatedProducts = products.map((product, i) =>
      i === index
        ? {
            ...product,
            quantity: newQuantity,
            subtotal: product.price * newQuantity,
          }
        : product
    );
    setProducts(updatedProducts);
    calculateTotals(updatedProducts);
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    calculateTotals(updatedProducts);
  };

  const calculateTotals = (currentProducts: Product[]) => {
    const newMrp = currentProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const newItemCount = currentProducts.length;
    const newTotalQuantity = currentProducts.reduce(
      (sum, product) => sum + product.quantity,
      0
    );
    setMrp(newMrp);
    setNumberOfItems(newItemCount);
    setTotalItemsQuantity(newTotalQuantity);
    setTotalPayableAmount(newMrp - totalDiscount); // Assuming discount applies to total MRP
    setPayableAmountAddition(newMrp - totalDiscount);
    setChange(totalReceivedAmount - (newMrp - totalDiscount));
  };

  const handlePaymentAmount1Change = (value: string) => {
    const parsedValue = parseFloat(value);
    setPaymentAmount1(isNaN(parsedValue) ? 0 : parsedValue);
    setTotalReceivedAmount((isNaN(parsedValue) ? 0 : parsedValue) + paymentAmount2);
    setChange(
      (isNaN(parsedValue) ? 0 : parsedValue) + paymentAmount2 - totalPayableAmount
    );
  };

  const handlePaymentAmount2Change = (value: string) => {
    const parsedValue = parseFloat(value);
    setPaymentAmount2(isNaN(parsedValue) ? 0 : parsedValue);
    setTotalReceivedAmount(paymentAmount1 + (isNaN(parsedValue) ? 0 : parsedValue));
    setChange(
      paymentAmount1 + (isNaN(parsedValue) ? 0 : parsedValue) - totalPayableAmount
    );
  };

  if (loadingSalesPeople || loadingPaymentMethods || loadingProductSearch) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <div className="flex flex-col gap-4">
        {/* Product & Customer Navigation */}
        <div className="bg-white rounded-md shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">
            Product & Customer Navigation
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="invoiceNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Invoice Number
              </label>
              <input
                type="text"
                id="invoiceNumber"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="productBarcode"
                className="block text-sm font-medium text-gray-700"
              >
                Product Barcode
              </label>
              <input
                type="text"
                id="productBarcode"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={productBarcode}
                onChange={handleBarcodeChange}
                onKeyDown={handleBarcodeSubmit}
              />
            </div>
            <div>
              <label
                htmlFor="customerPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                type="text"
                id="customerPhone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="membershipId"
                className="block text-sm font-medium text-gray-700"
              >
                Membership Id
              </label>
              <input
                type="text"
                id="membershipId"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={membershipId}
                onChange={(e) => setMembershipId(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="salesPerson"
                className="block text-sm font-medium text-gray-700"
              >
                Select Sales Person
              </label>
              <select
                id="salesPerson"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={salesPerson}
                onChange={(e) => setSalesPerson(e.target.value)}
              >
                <option value="">Select Sales Person</option>
                {salesPeopleOptions.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.firstName || employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="discountType"
                className="block text-sm font-medium text-gray-700"
              >
                Select Discount Type
              </label>
              <select
                id="discountType"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option>Fixed</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div>
              <label
                htmlFor="discountAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Enter The Discount Amount
              </label>
              <input
                type="text"
                id="discountAmount"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="vatAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Enter The VAT Amount
              </label>
              <input
                type="text"
                id="vatAmount"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={vatAmount}
                onChange={(e) => setVatAmount(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Products Information */}
        <div className="bg-white rounded-md shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Products Information</h2>
          {products.map((product, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="mt-1 text-sm text-gray-500">{product.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <p className="mt-1 text-sm text-gray-500">{product.size}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Available Stock
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.availableStock}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <p className="mt-1 text-sm text-gray-500">{product.sku}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Tk. {product.price}
                  </p>
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <div>
                    <label
                      htmlFor={`quantity-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Quantity
                    </label>
                    <div className="flex items-center mt-1">
                      <button
                        type="button"
                        className="bg-gray-200 text-gray-700 rounded-l-md px-2 py-1 focus:outline-none"
                        onClick={() =>
                          handleProductQuantityChange(
                            index,
                            Math.max(1, product.quantity - 1)
                          )
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        id={`quantity-${index}`}
                        className="w-16 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={product.quantity}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value, 10);
                          if (!isNaN(newValue) && newValue > 0) {
                            handleProductQuantityChange(index, newValue);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="bg-gray-200 text-gray-700 rounded-r-md px-2 py-1 focus:outline-none"
                        onClick={() =>
                          handleProductQuantityChange(
                            index,
                            product.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subtotal
                    </label>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      Tk. {product.subtotal}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    onClick={() => handleRemoveProduct(index)}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {/* Customer's Information */}
        <div className="bg-white rounded-md shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Customer's Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-sm text-gray-500">{customerName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <p className="mt-1 text-sm text-gray-500">{customerPhone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Membership
              </label>
              <p className="mt-1 text-sm text-gray-500">{customerMembership}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount
              </label>
              <p className="mt-1 text-sm text-gray-500">{customerDiscount}</p>
            </div>
          </div>
        </div>
        {/* Calculation */}
        <div className="bg-white rounded-md shadow-md p-4">
          <div>
            <h2 className="text-lg font-semibold mb-4">Calculation</h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maximum Retail Price (MRP)
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  Tk. {mrp.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  (-) Discount
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  Tk. {totalDiscount.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number Of Items
                </label>
                <p className="mt-1 text-sm text-gray-500">{numberOfItems}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Items Quantity
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  {totalItemsQuantity}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Total Payable Amount
                </label>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  Tk. {totalPayableAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}

          <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="paymentMethod1"
                className="block text-sm font-medium text-gray-700"
              >
                Choose the Method
              </label>
              <select
                id="paymentMethod1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={paymentMethod1}
                onChange={(e) => setPaymentMethod1(e.target.value)}
              >
                <option value="">Select Payment Method</option>
                {paymentMethodsOptions.map((method) => (
                  <option key={method._id} value={method._id}>
                    {method.accountName} ({method.accountType})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="paymentAmount1"
                className="block text-sm font-medium text-gray-700"
              >
                Enter Payment Amount
              </label>
              <input
                type="number"
                id="paymentAmount1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={paymentAmount1}
                onChange={(e) => handlePaymentAmount1Change(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="paymentMethod2"
                className="block text-sm font-medium text-gray-700"
              >
                Choose the Method
              </label>
              <select
                id="paymentMethod2"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={paymentMethod2}
                onChange={(e) => setPaymentMethod2(e.target.value)}
              >
                <option value="">Select Payment Method</option>
                {paymentMethodsOptions.map((method) => (
                  <option key={method._id} value={method._id}>
                    {method.accountName} ({method.accountType})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="paymentAmount2"
                className="block text-sm font-medium text-gray-700"
              >
                Enter Payment Amount
              </label>
              <input
                type="number"
                id="paymentAmount2"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={paymentAmount2}
                onChange={(e) => handlePaymentAmount2Change(e.target.value)}
              />
            </div>
          </div>

          {/* Addition Information */}

          <h2 className="text-lg font-semibold mb-4">Addition Information</h2>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payable Amount
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Tk. {payableAmountAddition.toFixed(2)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Received Amount
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Tk. {totalReceivedAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                Change
              </label>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                Tk. {change.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="  p-4 flex items-center justify-around">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Cancel & Clear
            </button>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Add to POS
            </button>
          </div>

          {/* Bottom Buttons */}
          <div className="  p-4 grid grid-cols-3 gap-10 items-center justify-around">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Hold
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Hold List
            </button>
            <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              SMS
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Quotation
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Reattempt
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Reprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;