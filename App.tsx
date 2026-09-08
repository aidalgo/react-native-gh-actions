import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const workflowSteps = [
  {
    number: '01',
    title: 'Edit anywhere',
    detail: 'Write React Native code on Windows, Linux, or macOS.',
  },
  {
    number: '02',
    title: 'Push to GitHub',
    detail: 'Git sends the same source code to the shared repository.',
  },
  {
    number: '03',
    title: 'Start a Mac runner',
    detail: 'GitHub Actions provisions macOS with Xcode installed.',
  },
  {
    number: '04',
    title: 'Build with Xcode',
    detail: 'The runner installs CocoaPods and compiles the iOS app.',
  },
  {
    number: '05',
    title: 'Publish the app',
    detail: 'The unsigned simulator .app is saved as a run artifact.',
  },
  {
    number: '06',
    title: 'Release when ready',
    detail: 'Configured Apple credentials unlock a TestFlight upload.',
    optional: true,
  },
];

function App(): React.JSX.Element {
  const [buildNumber, setBuildNumber] = useState(1);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.content}
        >
          <View style={styles.eyebrowRow}>
            <View style={styles.liveDot} />
            <Text style={styles.eyebrow}>
              CROSS-PLATFORM SOURCE · NATIVE iOS BUILD
            </Text>
          </View>

          <Text style={styles.title}>Code anywhere.{`\n`}Build on a Mac.</Text>
          <Text style={styles.subtitle}>
            Your laptop writes the React Native experience. GitHub Actions and
            Xcode turn it into an iOS application.
          </Text>

          <View style={styles.pipeline}>
            <View style={styles.pipelineNode}>
              <Text style={styles.nodeIcon}>⌨</Text>
              <Text style={styles.nodeLabel}>ANY OS</Text>
            </View>
            <View style={styles.connector}>
              <View style={styles.connectorLine} />
              <Text style={styles.arrow}>›</Text>
            </View>
            <View style={[styles.pipelineNode, styles.githubNode]}>
              <Text style={styles.nodeIcon}>◆</Text>
              <Text style={styles.nodeLabel}>GITHUB</Text>
            </View>
            <View style={styles.connector}>
              <View style={styles.connectorLine} />
              <Text style={styles.arrow}>›</Text>
            </View>
            <View style={[styles.pipelineNode, styles.appleNode]}>
              <Text style={styles.nodeIcon}>X</Text>
              <Text style={styles.nodeLabel}>XCODE</Text>
            </View>
          </View>

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>THE WORKFLOW</Text>
            <Text style={styles.stepCount}>6 STEPS</Text>
          </View>

          <View style={styles.steps}>
            {workflowSteps.map((step, index) => (
              <View key={step.number} style={styles.stepRow}>
                <View style={styles.rail}>
                  <View
                    style={[
                      styles.stepMarker,
                      step.optional && styles.optionalMarker,
                    ]}
                  >
                    <Text style={styles.stepNumber}>{step.number}</Text>
                  </View>
                  {index < workflowSteps.length - 1 ? (
                    <View style={styles.railLine} />
                  ) : null}
                </View>
                <View style={styles.stepCopy}>
                  <View style={styles.stepTitleRow}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    {step.optional ? (
                      <Text style={styles.optionalBadge}>OPTIONAL</Text>
                    ) : null}
                  </View>
                  <Text style={styles.stepDetail}>{step.detail}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.buildCard}>
            <View>
              <Text style={styles.buildLabel}>LOCAL DEMO STATE</Text>
              <Text style={styles.buildValue}>Build #{buildNumber}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Simulate a source code edit"
              onPress={() => setBuildNumber(current => current + 1)}
              style={({ pressed }) => [
                styles.buildButton,
                pressed && styles.buildButtonPressed,
              ]}
            >
              <Text style={styles.buildButtonText}>SIMULATE EDIT</Text>
            </Pressable>
          </View>

          <Text style={styles.footer}>
            The real build definition lives in .github/workflows/ios.yml
          </Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#07111F',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#71F6B7',
    marginRight: 9,
  },
  eyebrow: {
    color: '#71F6B7',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: '#F5F8FC',
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '800',
    letterSpacing: -1.8,
  },
  subtitle: {
    color: '#9AA9BD',
    fontSize: 17,
    lineHeight: 26,
    marginTop: 18,
    maxWidth: 520,
  },
  pipeline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 36,
    padding: 14,
    borderWidth: 1,
    borderColor: '#23344B',
    backgroundColor: '#0B192A',
    borderRadius: 18,
  },
  pipelineNode: {
    flex: 1,
    minHeight: 82,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#122238',
  },
  githubNode: {
    backgroundColor: '#17243A',
  },
  appleNode: {
    backgroundColor: '#16332F',
  },
  nodeIcon: {
    color: '#F5F8FC',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 7,
  },
  nodeLabel: {
    color: '#B8C4D3',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  connector: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorLine: {
    position: 'absolute',
    width: 24,
    height: 1,
    backgroundColor: '#35506F',
  },
  arrow: {
    color: '#71F6B7',
    fontSize: 24,
    backgroundColor: '#0B192A',
    paddingHorizontal: 3,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#23344B',
  },
  sectionTitle: {
    color: '#E6ECF3',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  stepCount: {
    color: '#667890',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  steps: {
    paddingTop: 22,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 88,
  },
  rail: {
    width: 48,
    alignItems: 'center',
  },
  stepMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B3F39',
    borderWidth: 1,
    borderColor: '#4AAF82',
  },
  optionalMarker: {
    backgroundColor: '#3A311B',
    borderColor: '#C69B48',
  },
  stepNumber: {
    color: '#F5F8FC',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  railLine: {
    flex: 1,
    width: 1,
    backgroundColor: '#294058',
  },
  stepCopy: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 22,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepTitle: {
    color: '#F5F8FC',
    fontSize: 17,
    fontWeight: '700',
  },
  optionalBadge: {
    color: '#E1B967',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#3A311B',
  },
  stepDetail: {
    color: '#8798AE',
    fontSize: 14,
    lineHeight: 20,
  },
  buildCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: '#F2F6F9',
  },
  buildLabel: {
    color: '#617086',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 5,
  },
  buildValue: {
    color: '#0A1625',
    fontSize: 20,
    fontWeight: '800',
  },
  buildButton: {
    backgroundColor: '#0D7658',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 9,
  },
  buildButtonPressed: {
    opacity: 0.72,
  },
  buildButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  footer: {
    color: '#52657D',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default App;
