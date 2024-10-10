# MSD JavaScript CodeCraft 2024-10-10 example

This repo simulates multiple ways how to block and not block (for a long time)
event loop by "heavy" processing.

Just to try to load data from the endpoint once:

```bash
curl http://localhost:3000/process-data-sync -o ./tmp/s.json
curl http://localhost:3000/process-data-async -o ./tmp/as.json
curl http://localhost:3000/process-data-stream -o ./tmp/st.json
curl http://localhost:3000/process-data-immediate -o ./tmp/i.json
curl http://localhost:3000/process-data-chunks -o ./tmp/c.json
```

```bash
npx artillery run load-test.yaml --record --key $ARTILLERY_KEY -e sync --name sync ; sleep 1
npx artillery run load-test.yaml --record --key $ARTILLERY_KEY -e async --name async ; sleep 1
npx artillery run load-test.yaml --record --key $ARTILLERY_KEY -e stream --name stream; sleep 1
npx artillery run load-test.yaml --record --key $ARTILLERY_KEY -e immediate --name immediate; sleep 1
npx artillery run load-test.yaml --record --key $ARTILLERY_KEY -e chunks --name chunks; sleep 1
```

```bash
npx artillery run load-test-low.yaml --record --key $ARTILLERY_KEY -e sync ; sleep 1
npx artillery run load-test-low.yaml --record --key $ARTILLERY_KEY -e async ; sleep 1
npx artillery run load-test-low.yaml --record --key $ARTILLERY_KEY -e stream ; sleep 1
npx artillery run load-test-low.yaml --record --key $ARTILLERY_KEY -e immediate ; sleep 1
npx artillery run load-test-low.yaml --record --key $ARTILLERY_KEY -e chunks ; sleep 1
```

```bash
npx artillery run load-test.yaml --output ./tmp/report-sync.json -e sync --name sync ; npx artillery report ./tmp/report-sync.json ; sleep 10
npx artillery run load-test.yaml --output ./tmp/report-async.json -e async --name async ; npx artillery report ./tmp/report-async.json ; sleep 10
npx artillery run load-test.yaml --output ./tmp/report-stream.json -e stream --name stream; npx artillery report ./tmp/report-stream.json ; sleep 10
npx artillery run load-test.yaml --output ./tmp/report-immediate.json -e immediate --name immediate; npx artillery report ./tmp/report-immediate.json ; sleep 10
npx artillery run load-test.yaml --output ./tmp/report-chunks.json -e chunks --name chunks; npx artillery report ./tmp/report-chunks.json ; sleep 10
```
