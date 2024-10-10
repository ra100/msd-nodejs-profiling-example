# MSD JavaScript CodeCraft 2024-10-10 example

This repo simulates multiple ways how to block and not block (for a long time)
event loop by "heavy" processing.

Just to try to load data from the endpoint once:

````bash
curl http://localhost:3000/process-data-sync -o ./tmp/s.json
curl http://localhost:3000/process-data-async -o ./tmp/as.json
curl http://localhost:3000/process-data-stream -o ./tmp/st.json
curl http://localhost:3000/process-data-immediate -o ./tmp/i.json
curl http://localhost:3000/process-data-chunks -o ./tmp/c.json
```

```bash
npx artillery run load-test.yaml --record --key $ARTILLERY_KEY -e sync
npx artillery run load-test.yaml --record --key $ARTILLERY_KEY -e async
npx artillery run load-test.yaml --record --key $ARTILLERY_KEY -e stream
npx artillery run load-test.yaml --record --key $ARTILLERY_KEY -e immediate
npx artillery run load-test.yaml --record --key $ARTILLERY_KEY -e chunks
````
