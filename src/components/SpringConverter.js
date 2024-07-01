"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const SpringConverter = () => {
	const [iosInputType, setIosInputType] = useState("responseDamping")
	const [outputType, setOutputType] = useState("android")
	const [response, setResponse] = useState(0.3)
	const [dampingFraction, setDampingFraction] = useState(0.7)
	const [duration, setDuration] = useState(0.29)
	const [bounce, setBounce] = useState(0.3)
	const [androidStiffness, setAndroidStiffness] = useState(0)
	const [androidDampingRatio, setAndroidDampingRatio] = useState(0)
	const [genericStiffness, setGenericStiffness] = useState(0)
	const [genericDamping, setGenericDamping] = useState(0)

	const MASS = 1 // Fixed mass value

	const roundToTwoDecimals = (num) => {
		return Math.round((num + Number.EPSILON) * 100) / 100
	}

	useEffect(() => {
		// Convert iOS parameters to other formats
		const omega = (2 * Math.PI) / response
		const stiff = Math.pow(omega, 2) * MASS
		const damping = (4 * Math.PI * dampingFraction * MASS) / response

		setAndroidStiffness(roundToTwoDecimals(stiff))
		setAndroidDampingRatio(
			roundToTwoDecimals(damping / (2 * Math.sqrt(MASS * stiff)))
		)
		setDuration(roundToTwoDecimals(response * 0.95))
		setBounce(roundToTwoDecimals(1 - dampingFraction))
		setGenericStiffness(roundToTwoDecimals(stiff))
		setGenericDamping(roundToTwoDecimals(damping))
	}, [response, dampingFraction])

	const handleDurationBounceChange = (newDuration, newBounce) => {
		const newResponse = roundToTwoDecimals(newDuration / 0.95)
		const newDampingFraction = roundToTwoDecimals(1 - newBounce)

		setResponse(newResponse)
		setDampingFraction(newDampingFraction)
		setDuration(roundToTwoDecimals(newDuration))
		setBounce(roundToTwoDecimals(newBounce))
	}

	return (
		<div className="max-w-md p-4 mx-auto">
			<Card>
				<CardHeader>
					<CardTitle>iOS Spring Converter</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs value={iosInputType} onValueChange={setIosInputType}>
						<TabsList className="grid w-full grid-cols-2 mb-4">
							<TabsTrigger value="responseDamping">
								Response & Damping
							</TabsTrigger>
							<TabsTrigger value="durationBounce">
								Duration & Bounce
							</TabsTrigger>
						</TabsList>
						<TabsContent value="responseDamping">
							<div className="space-y-4">
								<div>
									<Label htmlFor="response">iOS Response (seconds)</Label>
									<Input
										id="response"
										type="number"
										value={response}
										onChange={(e) =>
											setResponse(
												roundToTwoDecimals(parseFloat(e.target.value))
											)
										}
										step="0.01"
										min="0"
									/>
								</div>
								<div>
									<Label htmlFor="dampingFraction">iOS Damping Fraction</Label>
									<Input
										id="dampingFraction"
										type="number"
										value={dampingFraction}
										onChange={(e) =>
											setDampingFraction(
												roundToTwoDecimals(parseFloat(e.target.value))
											)
										}
										step="0.01"
										min="0"
										max="1"
									/>
								</div>
							</div>
						</TabsContent>
						<TabsContent value="durationBounce">
							<div className="space-y-4">
								<div>
									<Label htmlFor="duration">iOS Duration (seconds)</Label>
									<Input
										id="duration"
										type="number"
										value={duration}
										onChange={(e) =>
											handleDurationBounceChange(
												parseFloat(e.target.value),
												bounce
											)
										}
										step="0.01"
										min="0"
									/>
								</div>
								<div>
									<Label htmlFor="bounce">iOS Bounce</Label>
									<Input
										id="bounce"
										type="number"
										value={bounce}
										onChange={(e) =>
											handleDurationBounceChange(
												duration,
												parseFloat(e.target.value)
											)
										}
										step="0.01"
										min="0"
										max="1"
									/>
								</div>
							</div>
						</TabsContent>
					</Tabs>

					<div className="mt-8">
						<Tabs value={outputType} onValueChange={setOutputType}>
							<TabsList className="grid w-full grid-cols-2 mb-4">
								<TabsTrigger value="android">Android</TabsTrigger>
								<TabsTrigger value="generic">Generic</TabsTrigger>
							</TabsList>
							<TabsContent value="android">
								<div className="space-y-4">
									<div>
										<Label>Android Stiffness</Label>
										<Input value={androidStiffness.toFixed(2)} readOnly />
									</div>
									<div>
										<Label>Android Damping Ratio</Label>
										<Input value={androidDampingRatio.toFixed(2)} readOnly />
									</div>
								</div>
							</TabsContent>
							<TabsContent value="generic">
								<div className="space-y-4">
									<div>
										<Label>Generic Stiffness</Label>
										<Input value={genericStiffness.toFixed(2)} readOnly />
									</div>
									<div>
										<Label>Generic Damping</Label>
										<Input value={genericDamping.toFixed(2)} readOnly />
									</div>
									<div>
										<Label>Mass</Label>
										<Input value={MASS.toFixed(2)} readOnly />
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default SpringConverter
