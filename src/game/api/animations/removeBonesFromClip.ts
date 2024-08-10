import { AnimationClip } from "three";

export function removesBonesFromClip(clip: AnimationClip, bones: string[]) {
    // Clone the original clip
    const newClip = clip.clone();

    // Filter the tracks to keep only those affecting the specified bones
    newClip.tracks = newClip.tracks.filter(track => {
        // Extract the bone name from the track's name
        const trackName = track.name;
        const boneName = trackName.split(".")[0];

        // Check if the bone name is in the list of bones to keep
        return bones.includes(boneName);
    });

    // Update the duration of the new clip to match the filtered tracks
    if (newClip.tracks.length > 0) {
        newClip.duration = Math.max(
            ...newClip.tracks.map(track => Math.max(...track.times))
        );
    } else {
        newClip.duration = 0;
    }

    return newClip;
}
export function cloneAndCutClipByTime(
    clip: AnimationClip,
    startTime: number,
    endTime: number
): AnimationClip {
    // Clone the original clip
    const newClip = clip.clone();

    // Iterate through each track in the clip
    newClip.tracks.forEach(track => {
        // Get the times and values arrays
        const times = track.times as Float32Array;
        const values = track.values as Float32Array;

        // Create new arrays to store the filtered times and values
        const newTimes: number[] = [];
        const newValues: number[] = [];

        // Determine the value size (e.g., 3 for position, 4 for quaternion rotation)
        const valueSize = values.length / times.length;

        // Loop through the keyframes and keep only those within the specified time range
        for (let i = 0; i < times.length; i++) {
            const time = times[i];
            if (time >= startTime && time < endTime) {
                // Add the time to the newTimes array
                newTimes.push(time);

                // Add the corresponding values to the newValues array
                for (let j = 0; j < valueSize; j++) {
                    newValues.push(values[i * valueSize + j]);
                }
            }
        }

        // Update the track with the new times and values
        track.times = new Float32Array(newTimes);
        track.values = new Float32Array(newValues);
    });

    // Update the duration of the new clip to match the end time
    newClip.duration = endTime - startTime;

    return newClip;
}
