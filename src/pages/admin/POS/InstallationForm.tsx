"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IFormInput {
  installationDate: string;
  status: "pending" | "completed" | "in-progress" | "canceled" | "delayed";
  address: string;
  phoneNumber: string;
  additionalNote?: string;
  installationCharge: number;
}

export default function InstallationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    // Here you would typically send this data to your backend
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Installation Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Installation Date */}
          <div>
            <label
              htmlFor="installationDate"
              className="block text-sm font-medium text-gray-700"
            >
              Installation Date
            </label>
            <Input
              id="installationDate"
              type="date"
              {...register("installationDate", {
                required: "Installation date is required",
              })}
              className="flex-1"
            />
            {errors.installationDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.installationDate.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              type="tel"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <Input
            id="address"
            type="text"
            {...register("address", { required: "Address is required" })}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Additional Note */}
        <div>
          <label
            htmlFor="additionalNote"
            className="block text-sm font-medium text-gray-700"
          >
            Additional Note
          </label>
          <textarea
            id="additionalNote"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={3}
            {...register("additionalNote")}
          ></textarea>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <Select
            onValueChange={(value) => {
              register("status").onChange({ target: { value } });
            }}
          >
            <SelectTrigger
              id="status"
              className="mt-1 flex-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {/* Installation Charge */}
        <div>
          <label
            htmlFor="installationCharge"
            className="block text-sm font-medium text-gray-700"
          >
            Installation Charge
          </label>
          <Input
            id="installationCharge"
            type="number"
            step="0.01"
            {...register("installationCharge", {
              required: "Installation charge is required",
              min: {
                value: 0,
                message: "Installation charge must be a positive number",
              },
            })}
          />
          {errors.installationCharge && (
            <p className="mt-1 text-sm text-red-600">
              {errors.installationCharge.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Add Installation
        </Button>
      </form>
    </div>
  );
}
